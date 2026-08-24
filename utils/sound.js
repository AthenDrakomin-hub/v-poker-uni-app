/**
 * V-Poker 音效管理系统
 * 支持主题音效、发牌声、筹码声、开牌声、背景音乐
 */

class SoundManager {
  constructor() {
    this.audioContexts = {}
    this.enabled = true
    this.vibrateEnabled = true
    this.volume = 0.5
    this.currentTheme = null
    this.backgroundAudio = null
    this.soundCache = {}
  }

  /**
   * 初始化
   */
  init(theme = 'forbidden_city') {
    this.currentTheme = theme
    // 预加载常用音效
    this.preloadSounds()
  }

  /**
   * 设置主题
   */
  setTheme(theme) {
    this.currentTheme = theme
    this.stopBackground()
    // 预加载新主题音效
    this.preloadSounds()
  }

  /**
   * 预加载音效
   */
  preloadSounds() {
    const sounds = ['deal', 'chip', 'openCard', 'win']
    sounds.forEach(type => {
      this.getAudio(type)
    })
  }

  /**
   * 获取音频实例
   */
  getAudio(type) {
    const key = this.currentTheme + '_' + type
    if (this.soundCache[key]) {
      return this.soundCache[key]
    }

    try {
      const audio = uni.createInnerAudioContext()
      audio.volume = this.volume
      // 音效路径（实际项目中需要放入对应文件）
      // audio.src = `/static/sounds/${this.currentTheme}/${type}.mp3`
      this.soundCache[key] = audio
      return audio
    } catch (e) {
      console.error('[Sound] 创建音频失败', e)
      return null
    }
  }

  /**
   * 播放音效
   */
  play(type, options = {}) {
    if (!this.enabled) return

    const audio = this.getAudio(type)
    if (!audio) return

    try {
      if (options.volume !== undefined) {
        audio.volume = options.volume
      } else {
        audio.volume = this.volume
      }

      audio.seek(0)
      audio.play()

      // 震动反馈
      if (this.vibrateEnabled && options.vibrate) {
        uni.vibrateShort({ type: 'light' })
      }
    } catch (e) {
      console.error('[Sound] 播放失败', type, e)
    }
  }

  /**
   * 发牌声
   */
  playDeal() {
    this.play('deal', { vibrate: false })
  }

  /**
   * 筹码声
   */
  playChip() {
    this.play('chip', { vibrate: true })
  }

  /**
   * 开牌声
   */
  playOpenCard() {
    this.play('openCard', { vibrate: true, volume: 0.8 })
  }

  /**
   * 赢牌声
   */
  playWin() {
    this.play('win', { vibrate: true, volume: 0.7 })
  }

  /**
   * 看牌声（炸金花专属）
   */
  playLookCard() {
    this.play('lookCard', { vibrate: false, volume: 0.4 })
  }

  /**
   * 弃牌声
   */
  playFold() {
    this.play('fold', { vibrate: false, volume: 0.3 })
  }

  /**
   * 按钮点击声
   */
  playButton() {
    this.play('button', { vibrate: false, volume: 0.3 })
  }

  /**
   * 播放背景音乐
   */
  playBackground() {
    if (!this.enabled) return
    if (this.backgroundAudio) {
      this.backgroundAudio.play()
      return
    }

    try {
      this.backgroundAudio = uni.createInnerAudioContext()
      this.backgroundAudio.loop = true
      this.backgroundAudio.volume = 0.15
      // this.backgroundAudio.src = `/static/sounds/${this.currentTheme}/background.mp3`
      this.backgroundAudio.play()
    } catch (e) {
      console.error('[Sound] 背景音乐播放失败', e)
    }
  }

  /**
   * 暂停背景音乐
   */
  pauseBackground() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause()
    }
  }

  /**
   * 停止背景音乐
   */
  stopBackground() {
    if (this.backgroundAudio) {
      this.backgroundAudio.stop()
      this.backgroundAudio.destroy()
      this.backgroundAudio = null
    }
  }

  /**
   * 设置音量
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    Object.values(this.soundCache).forEach(audio => {
      if (audio) audio.volume = this.volume
    })
  }

  /**
   * 启用/禁用音效
   */
  setEnabled(enabled) {
    this.enabled = enabled
    if (!enabled) {
      this.stopBackground()
    }
  }

  /**
   * 启用/禁用震动
   */
  setVibrateEnabled(enabled) {
    this.vibrateEnabled = enabled
  }

  /**
   * 震动反馈
   */
  vibrate(type = 'light') {
    if (!this.vibrateEnabled) return
    try {
      if (type === 'long') {
        uni.vibrateLong()
      } else {
        uni.vibrateShort({ type })
      }
    } catch (e) {
      // 忽略
    }
  }

  /**
   * 销毁所有音频
   */
  destroy() {
    this.stopBackground()
    Object.values(this.soundCache).forEach(audio => {
      if (audio) {
        audio.stop()
        audio.destroy()
      }
    })
    this.soundCache = {}
  }
}

// 单例
let soundManagerInstance = null

export function getSoundManager() {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager()
  }
  return soundManagerInstance
}

export function destroySoundManager() {
  if (soundManagerInstance) {
    soundManagerInstance.destroy()
    soundManagerInstance = null
  }
}

export default {
  getSoundManager,
  destroySoundManager,
}
