<template>
  <view class="settings-page">
    <view class="page-bg">
      <view class="bg-gradient"></view>
    </view>
    <view class="top-nav">
      <view class="nav-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">设置</text>
      </view>
    </view>
    <scroll-view class="main-content" scroll-y>
      <view class="settings-group">
        <text class="group-title">游戏设置</text>
        <view class="settings-list">
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-yellow"><text>🔊</text></view>
              <text class="setting-name">音效</text>
            </view>
            <switch class="setting-switch" :checked="settings.soundEnabled" @change="toggleSound" color="#FFD700" />
          </view>
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-blue"><text>🎵</text></view>
              <text class="setting-name">背景音乐</text>
            </view>
            <switch class="setting-switch" :checked="settings.musicEnabled" @change="toggleMusic" color="#FFD700" />
          </view>
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-green"><text>📳</text></view>
              <text class="setting-name">震动反馈</text>
            </view>
            <switch class="setting-switch" :checked="settings.vibrationEnabled" @change="toggleVibration" color="#FFD700" />
          </view>
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-purple"><text>✨</text></view>
              <text class="setting-name">开牌动画</text>
            </view>
            <switch class="setting-switch" :checked="settings.animationEnabled" @change="toggleAnimation" color="#FFD700" />
          </view>
        </view>
      </view>
      <view class="settings-group" v-if="settings.soundEnabled">
        <text class="group-title">音效调节</text>
        <view class="settings-list">
          <view class="setting-item setting-slider">
            <view class="setting-left"><text class="setting-name">音效音量</text></view>
            <view class="slider-container">
              <slider class="volume-slider" :value="settings.soundVolume" :min="0" :max="100" :step="5" activeColor="#FFD700" backgroundColor="rgba(255,255,255,0.1)" block-size="20" @change="onSoundVolumeChange" />
              <text class="slider-value">{{ settings.soundVolume }}%</text>
            </view>
          </view>
          <view class="setting-item setting-slider" v-if="settings.musicEnabled">
            <view class="setting-left"><text class="setting-name">音乐音量</text></view>
            <view class="slider-container">
              <slider class="volume-slider" :value="settings.musicVolume" :min="0" :max="100" :step="5" activeColor="#FFD700" backgroundColor="rgba(255,255,255,0.1)" block-size="20" @change="onMusicVolumeChange" />
              <text class="slider-value">{{ settings.musicVolume }}%</text>
            </view>
          </view>
        </view>
      </view>
      <view class="settings-group">
        <text class="group-title">显示设置</text>
        <view class="settings-list">
          <view class="setting-item" @click="showThemeSelector = true">
            <view class="setting-left">
              <view class="setting-icon icon-pink"><text>🎨</text></view>
              <text class="setting-name">游戏主题</text>
            </view>
            <view class="setting-right">
              <text class="setting-value">{{ getThemeName(settings.theme) }}</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-cyan"><text>🖥️</text></view>
              <text class="setting-name">画质</text>
            </view>
            <view class="quality-options">
              <view v-for="q in qualityOptions" :key="q.value" class="quality-btn" :class="{ active: settings.quality === q.value }" @click="setQuality(q.value)">
                <text>{{ q.label }}</text>
              </view>
            </view>
          </view>
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-orange"><text>🔆</text></view>
              <text class="setting-name">屏幕常亮</text>
            </view>
            <switch class="setting-switch" :checked="settings.keepScreenOn" @change="toggleKeepScreenOn" color="#FFD700" />
          </view>
        </view>
      </view>
      <view class="settings-group">
        <text class="group-title">账号设置</text>
        <view class="settings-list">
          <view class="setting-item" @click="changePassword">
            <view class="setting-left">
              <view class="setting-icon icon-red"><text>🔐</text></view>
              <text class="setting-name">修改密码</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
          <view class="setting-item" @click="clearCache">
            <view class="setting-left">
              <view class="setting-icon icon-gray"><text>🗑️</text></view>
              <text class="setting-name">清除缓存</text>
            </view>
            <view class="setting-right">
              <text class="setting-value">{{ cacheSize }}</text>
              <text class="setting-arrow">›</text>
            </view>
          </view>
        </view>
      </view>
      <view class="settings-group">
        <text class="group-title">关于</text>
        <view class="settings-list">
          <view class="setting-item">
            <view class="setting-left">
              <view class="setting-icon icon-indigo"><text>📱</text></view>
              <text class="setting-name">版本号</text>
            </view>
            <text class="setting-value">v2.0.0</text>
          </view>
          <view class="setting-item" @click="checkUpdate">
            <view class="setting-left">
              <view class="setting-icon icon-teal"><text>🔄</text></view>
              <text class="setting-name">检查更新</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
          <view class="setting-item" @click="userAgreement">
            <view class="setting-left">
              <view class="setting-icon icon-blue"><text>📄</text></view>
              <text class="setting-name">用户协议</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
          <view class="setting-item" @click="privacyPolicy">
            <view class="setting-left">
              <view class="setting-icon icon-green"><text>🔒</text></view>
              <text class="setting-name">隐私政策</text>
            </view>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </view>
      <view class="logout-section">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </view>
      <view class="bottom-spacing"></view>
    </scroll-view>
    <view v-if="showThemeSelector" class="modal-overlay" @click="showThemeSelector = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择游戏主题</text>
          <text class="modal-close" @click="showThemeSelector = false">✕</text>
        </view>
        <view class="theme-list">
          <view v-for="theme in themeOptions" :key="theme.value" class="theme-item" :class="{ active: settings.theme === theme.value }" @click="selectTheme(theme.value)">
            <view class="theme-preview" :style="{ background: theme.gradient }">
              <text class="theme-icon">{{ theme.icon }}</text>
            </view>
            <view class="theme-info">
              <text class="theme-name">{{ theme.name }}</text>
              <text class="theme-desc">{{ theme.desc }}</text>
            </view>
            <view v-if="settings.theme === theme.value" class="theme-check"><text>✓</text></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { logout } from '../../store/user.js'

export default {
  name: 'SettingsPage',
  data() {
    return {
      showThemeSelector: false,
      cacheSize: '2.3MB',
      settings: {
        soundEnabled: true,
        musicEnabled: false,
        vibrationEnabled: true,
        animationEnabled: true,
        soundVolume: 70,
        musicVolume: 50,
        theme: 'default',
        quality: 'high',
        keepScreenOn: true,
      },
      qualityOptions: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
      ],
      themeOptions: [
        { value: 'default', name: '经典黑金', desc: '默认主题，沉稳大气', icon: '♠️', gradient: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)' },
        { value: 'forbidden_city', name: '紫禁之巅', desc: '黑金帝王气场', icon: '🏯', gradient: 'linear-gradient(135deg, #2d1810, #4a2c1a)' },
        { value: 'jiangnan', name: '江南百景', desc: '水墨意境', icon: '🏔️', gradient: 'linear-gradient(135deg, #e8f4f8, #d4e8ed)' },
        { value: 'steampunk', name: '机械迷城', desc: '蒸汽朋克', icon: '⚙️', gradient: 'linear-gradient(135deg, #3d2817, #5c3d2e)' },
        { value: 'noir', name: '雾都夜话', desc: '暗黑悬疑', icon: '🎭', gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
        { value: 'wallstreet', name: '华尔街', desc: '金融交易', icon: '📈', gradient: 'linear-gradient(135deg, #0a1929, #132f4c)' },
      ],
    }
  },
  onLoad() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      try {
        const saved = uni.getStorageSync('vpoker_settings')
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) }
        }
      } catch (e) {
        console.error('加载设置失败', e)
      }
    },
    saveSettings() {
      try {
        uni.setStorageSync('vpoker_settings', JSON.stringify(this.settings))
      } catch (e) {
        console.error('保存设置失败', e)
      }
    },
    goBack() {
      uni.navigateBack()
    },
    toggleSound(e) {
      this.settings.soundEnabled = e.detail.value
      this.saveSettings()
    },
    toggleMusic(e) {
      this.settings.musicEnabled = e.detail.value
      this.saveSettings()
    },
    toggleVibration(e) {
      this.settings.vibrationEnabled = e.detail.value
      this.saveSettings()
    },
    toggleAnimation(e) {
      this.settings.animationEnabled = e.detail.value
      this.saveSettings()
    },
    onSoundVolumeChange(e) {
      this.settings.soundVolume = e.detail.value
      this.saveSettings()
    },
    onMusicVolumeChange(e) {
      this.settings.musicVolume = e.detail.value
      this.saveSettings()
    },
    getThemeName(theme) {
      const found = this.themeOptions.find(t => t.value === theme)
      return found ? found.name : '经典黑金'
    },
    selectTheme(theme) {
      this.settings.theme = theme
      this.saveSettings()
      this.showThemeSelector = false
      uni.showToast({ title: '主题已切换', icon: 'success' })
    },
    setQuality(quality) {
      this.settings.quality = quality
      this.saveSettings()
    },
    toggleKeepScreenOn(e) {
      this.settings.keepScreenOn = e.detail.value
      this.saveSettings()
    },
    changePassword() {
      uni.showToast({ title: '修改密码', icon: 'none' })
    },
    clearCache() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除缓存吗？这不会删除您的游戏数据。',
        success: (res) => {
          if (res.confirm) {
            this.cacheSize = '0KB'
            uni.showToast({ title: '缓存已清除', icon: 'success' })
          }
        }
      })
    },
    checkUpdate() {
      uni.showToast({ title: '当前已是最新版本', icon: 'none' })
    },
    userAgreement() {
      uni.showToast({ title: '查看用户协议', icon: 'none' })
    },
    privacyPolicy() {
      uni.showToast({ title: '查看隐私政策', icon: 'none' })
    },
    handleLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            logout()
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.settings-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.bg-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%);
}
.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 24rpx;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.back-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}
.back-icon {
  font-size: 24rpx;
  color: #e8e8e8;
}
.nav-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #e8e8e8;
}
.main-content {
  position: relative;
  z-index: 1;
  height: calc(100vh - 80rpx);
  padding: 20rpx;
}
.settings-group {
  margin-bottom: 24rpx;
}
.group-title {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10rpx;
  padding-left: 8rpx;
}
.settings-list {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  overflow: hidden;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 16rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.setting-item:last-child {
  border-bottom: none;
}
.setting-item:active {
  background: rgba(255, 255, 255, 0.05);
}
.setting-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.setting-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}
.icon-yellow { background: rgba(255, 215, 0, 0.15); }
.icon-blue { background: rgba(66, 153, 225, 0.15); }
.icon-green { background: rgba(72, 187, 120, 0.15); }
.icon-purple { background: rgba(159, 122, 234, 0.15); }
.icon-pink { background: rgba(236, 72, 153, 0.15); }
.icon-cyan { background: rgba(56, 178, 172, 0.15); }
.icon-orange { background: rgba(237, 137, 54, 0.15); }
.icon-red { background: rgba(245, 101, 101, 0.15); }
.icon-gray { background: rgba(113, 128, 150, 0.15); }
.icon-indigo { background: rgba(102, 126, 234, 0.15); }
.icon-teal { background: rgba(20, 184, 166, 0.15); }
.setting-name {
  font-size: 26rpx;
  color: #e8e8e8;
}
.setting-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.setting-value {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}
.setting-arrow {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.3);
}
.setting-switch {
  transform: scale(0.8);
}
.setting-slider {
  flex-direction: column;
  align-items: stretch;
  gap: 12rpx;
}
.slider-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.volume-slider {
  flex: 1;
}
.slider-value {
  font-size: 22rpx;
  color: #FFD700;
  min-width: 60rpx;
  text-align: right;
}
.quality-options {
  display: flex;
  gap: 8rpx;
}
.quality-btn {
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}
.quality-btn.active {
  background: rgba(255, 215, 0, 0.15);
  border-color: #FFD700;
  color: #FFD700;
}
.logout-section {
  padding: 20rpx 0;
}
.logout-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(245, 101, 101, 0.1);
  border: 1px solid rgba(245, 101, 101, 0.3);
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #F56565;
}
.bottom-spacing {
  height: 40rpx;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  width: 85%;
  max-width: 640rpx;
  max-height: 80vh;
  background: #1a1a2e;
  border-radius: 20rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 28rpx;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #e8e8e8;
}
.modal-close {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 10rpx;
}
.theme-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.theme-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  gap: 16rpx;
  position: relative;
}
.theme-item.active {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.08);
}
.theme-preview {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.theme-icon {
  font-size: 28rpx;
}
.theme-info {
  flex: 1;
}
.theme-name {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #e8e8e8;
  margin-bottom: 4rpx;
}
.theme-desc {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
}
.theme-check {
  width: 36rpx;
  height: 36rpx;
  background: #FFD700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-check text {
  font-size: 20rpx;
  color: #1a1a1a;
  font-weight: 700;
}
</style>
