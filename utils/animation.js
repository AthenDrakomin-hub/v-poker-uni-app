/**
 * V-Poker 动画工具
 * 缓动曲线 + 时间流控制
 */

/**
 * 缓动曲线
 */
export const Easing = {
  // 线性
  linear: (t) => t,

  // Ease-Out（快出慢停）- 发牌动画
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  easeOutQuint: (t) => 1 - Math.pow(1 - t, 5),

  // Ease-In-Out（慢入慢出）- 呼吸光晕
  easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,

  // Ease-Out-Back（带回弹）- 筹码飞入
  easeOutBack: (t) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },

  // 弹性
  elastic: (t) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },

  // 弹跳
  bounce: (t) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
}

/**
 * 动画时间流控制器
 * 管理多个动画的时序
 */
export class TimeFlowController {
  constructor() {
    this.animations = []
    this.timeline = []
    this.isPlaying = false
    this.startTime = 0
    this.animationFrame = null
  }

  /**
   * 添加动画到时间线
   */
  addAnimation(config) {
    this.timeline.push({
      id: config.id || 'anim_' + Date.now(),
      startTime: config.startTime || 0,
      duration: config.duration || 300,
      easing: config.easing || Easing.easeOut,
      onUpdate: config.onUpdate || (() => {}),
      onComplete: config.onComplete || (() => {}),
      delay: config.delay || 0,
      completed: false,
    })
    return this
  }

  /**
   * 播放时间线
   */
  play() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.startTime = Date.now()
    this.timeline.forEach(anim => anim.completed = false)
    this.tick()
  }

  /**
   * 帧循环
   */
  tick() {
    if (!this.isPlaying) return

    const now = Date.now()
    const elapsed = now - this.startTime

    let allCompleted = true

    this.timeline.forEach(anim => {
      if (anim.completed) return

      const animElapsed = elapsed - anim.startTime - anim.delay
      if (animElapsed < 0) {
        allCompleted = false
        return
      }

      const progress = Math.min(animElapsed / anim.duration, 1)
      const easedProgress = anim.easing(progress)

      try {
        anim.onUpdate(easedProgress, progress)
      } catch (e) {
        console.error('[Animation] onUpdate error', e)
      }

      if (progress >= 1) {
        anim.completed = true
        try {
          anim.onComplete()
        } catch (e) {
          console.error('[Animation] onComplete error', e)
        }
      } else {
        allCompleted = false
      }
    })

    if (allCompleted) {
      this.stop()
    } else {
      this.animationFrame = setTimeout(() => this.tick(), 16)
    }
  }

  /**
   * 停止动画
   */
  stop() {
    this.isPlaying = false
    if (this.animationFrame) {
      clearTimeout(this.animationFrame)
      this.animationFrame = null
    }
  }

  /**
   * 重置时间线
   */
  reset() {
    this.stop()
    this.timeline = []
  }

  /**
   * 销毁
   */
  destroy() {
    this.reset()
  }
}

/**
 * 呼吸光晕控制器
 * 90bpm频率，用于行动期玩家状态
 */
export class BreathingController {
  constructor() {
    this.isActive = false
    this.startTime = 0
    this.animationFrame = null
    this.onUpdate = null
    this.bpm = 90 // 每分钟心跳次数
  }

  /**
   * 开始呼吸
   */
  start(onUpdate) {
    this.onUpdate = onUpdate
    this.isActive = true
    this.startTime = Date.now()
    this.tick()
  }

  /**
   * 帧循环
   */
  tick() {
    if (!this.isActive) return

    const now = Date.now()
    const elapsed = now - this.startTime
    const beatDuration = 60000 / this.bpm // 一次心跳的时长(ms)
    const progress = (elapsed % beatDuration) / beatDuration

    // 呼吸曲线：0.3 -> 0.8 -> 0.3
    // 使用正弦波模拟呼吸
    const breathValue = 0.3 + 0.5 * (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2

    if (this.onUpdate) {
      try {
        this.onUpdate(breathValue, progress)
      } catch (e) {
        console.error('[Breathing] onUpdate error', e)
      }
    }

    this.animationFrame = setTimeout(() => this.tick(), 16)
  }

  /**
   * 停止呼吸
   */
  stop() {
    this.isActive = false
    if (this.animationFrame) {
      clearTimeout(this.animationFrame)
      this.animationFrame = null
    }
  }

  /**
   * 设置BPM
   */
  setBPM(bpm) {
    this.bpm = bpm
  }

  /**
   * 销毁
   */
  destroy() {
    this.stop()
    this.onUpdate = null
  }
}

/**
 * 数字滚动动画
 * 从from滚动到to
 */
export function animateNumber(from, to, duration, onUpdate, easing = Easing.easeOut) {
  const startTime = Date.now()
  const diff = to - from

  function tick() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easing(progress)
    const currentValue = from + diff * easedProgress

    if (onUpdate) {
      onUpdate(currentValue, progress)
    }

    if (progress < 1) {
      setTimeout(tick, 16)
    }
  }

  tick()
}

/**
 * 延迟执行
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  Easing,
  TimeFlowController,
  BreathingController,
  animateNumber,
  delay,
}
