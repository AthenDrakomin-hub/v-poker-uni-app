<template>
  <view class="login-page">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="bg-gradient"></view>
      <view class="bg-vignette"></view>
      <view class="bg-particles">
        <view v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></view>
      </view>
    </view>

    <!-- 主内容 -->
    <view class="login-content">
      <!-- 左侧品牌区 -->
      <view class="brand-section">
        <view class="brand-logo">
          <view class="logo-icon">
            <text class="logo-text">V</text>
          </view>
        </view>
        <view class="brand-name gold-text">V-POKER</view>
        <view class="brand-slogan">横屏沉浸式 · 竞技扑克平台</view>
        <view class="brand-features">
          <view class="feature-item">
            <text class="feature-icon">♠</text>
            <text class="feature-text">五大游戏</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">♥</text>
            <text class="feature-text">多级代理</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">♦</text>
            <text class="feature-text">透明抽水</text>
          </view>
        </view>
      </view>

      <!-- 右侧登录表单 -->
      <view class="form-section">
        <view class="form-card glass-card">
          <view class="form-title">
            <text class="title-text">欢迎回来</text>
            <text class="title-sub">登录您的账户开始竞技</text>
          </view>

          <!-- 账号输入 -->
          <view class="form-group">
            <text class="form-label">账号</text>
            <view class="input-wrapper">
              <text class="input-icon">👤</text>
              <input
                class="input-field"
                type="text"
                v-model="form.account"
                placeholder="请输入账号"
                placeholder-class="input-placeholder"
                :disabled="isLoading"
              />
            </view>
          </view>

          <!-- 密码输入 -->
          <view class="form-group">
            <text class="form-label">密码</text>
            <view class="input-wrapper">
              <text class="input-icon">🔒</text>
              <input
                class="input-field"
                :password="!showPassword"
                v-model="form.password"
                placeholder="请输入密码"
                placeholder-class="input-placeholder"
                :disabled="isLoading"
                @confirm="handleLogin"
              />
              <text class="input-toggle" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁' }}
              </text>
            </view>
          </view>

          <!-- 错误提示 -->
          <view v-if="error" class="form-error">
            <text class="error-text">{{ error }}</text>
          </view>

          <!-- 登录按钮 -->
          <view class="form-actions">
            <button
              class="btn-primary login-btn"
              :class="{ 'btn-loading': isLoading }"
              @click="handleLogin"
              :disabled="isLoading"
            >
              <text v-if="!isLoading">登 录</text>
              <text v-else class="loading-text">登录中...</text>
            </button>
          </view>

          <!-- 注册入口 -->
          <view class="form-footer">
            <text class="footer-text">还没有账号？</text>
            <text class="footer-link" @click="goRegister">立即注册</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部版权 -->
    <view class="login-footer">
      <text class="copyright">© 2026 V-Poker 2.0 · 仅供娱乐</text>
    </view>
  </view>
</template>

<script>
import { login, initUserState } from '../../store/user.js'

export default {
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      showPassword: false,
      isLoading: false,
      error: '',
    }
  },
  onLoad() {
    // 初始化用户状态
    initUserState()
    // 检查是否已登录
    const token = uni.getStorageSync('vpoker_token')
    if (token) {
      this.autoLogin()
    }
  },
  methods: {
    // 粒子样式
    particleStyle(index) {
      const left = (index * 5 + Math.random() * 3) % 100
      const top = (index * 7 + Math.random() * 5) % 100
      const size = 2 + Math.random() * 4
      const delay = Math.random() * 5
      const duration = 3 + Math.random() * 4
      return {
        left: left + '%',
        top: top + '%',
        width: size + 'px',
        height: size + 'px',
        animationDelay: delay + 's',
        animationDuration: duration + 's',
      }
    },

    // 自动登录（验证Token）
    async autoLogin() {
      try {
        const { fetchUserInfo } = await import('../../store/user.js')
        await fetchUserInfo()
        uni.reLaunch({ url: '/pages/lobby/lobby' })
      } catch (e) {
        // Token失效，继续显示登录页
      }
    },

    // 处理登录
    async handleLogin() {
      // 表单验证
      if (!this.form.account.trim()) {
        this.error = '请输入账号'
        return
      }
      if (!this.form.password) {
        this.error = '请输入密码'
        return
      }

      this.isLoading = true
      this.error = ''

      try {
        const data = await login(this.form.account.trim(), this.form.password)

        // 登录成功
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
        })

        // 跳转到大厅
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/lobby/lobby' })
        }, 1000)
      } catch (e) {
        this.error = e.error || '登录失败，请检查账号密码'
      } finally {
        this.isLoading = false
      }
    },

    // 去注册
    goRegister() {
      uni.showToast({
        title: '注册功能开发中',
        icon: 'none',
      })
    },
  },
}
</script>

<style lang="scss">
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(107, 70, 193, 0.06) 0%, transparent 50%),
              linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
}

.bg-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.7) 100%);
}

.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: rgba(255, 215, 0, 0.4);
  border-radius: 50%;
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.8;
  }
}

/* 主内容 */
.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
}

/* 品牌区 */
.brand-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 80rpx;
}

.brand-logo {
  margin-bottom: 32rpx;
}

.logo-icon {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(255, 215, 0, 0.4);
}

.logo-text {
  font-size: 72rpx;
  font-weight: 900;
  color: #1a1a1a;
}

.brand-name {
  font-size: 64rpx;
  font-weight: 900;
  letter-spacing: 8rpx;
  margin-bottom: 16rpx;
}

.brand-slogan {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 48rpx;
  letter-spacing: 2rpx;
}

.brand-features {
  display: flex;
  gap: 48rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.feature-icon {
  font-size: 36rpx;
  color: #FFD700;
}

.feature-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 表单区 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 80rpx;
}

.form-card {
  width: 100%;
  max-width: 560rpx;
  padding: 48rpx;
}

.form-title {
  margin-bottom: 40rpx;
}

.title-text {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #e8e8e8;
  margin-bottom: 8rpx;
}

.title-sub {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 表单组 */
.form-group {
  margin-bottom: 32rpx;
}

.form-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12rpx;
  padding: 0 20rpx;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.input-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
  opacity: 0.6;
}

.input-field {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #e8e8e8;
  background: transparent;
}

.input-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.input-toggle {
  font-size: 28rpx;
  padding: 10rpx;
  opacity: 0.6;
}

/* 错误提示 */
.form-error {
  margin-bottom: 24rpx;
  padding: 16rpx 20rpx;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8rpx;
}

.error-text {
  font-size: 24rpx;
  color: #FF6B6B;
}

/* 登录按钮 */
.form-actions {
  margin-top: 40rpx;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  letter-spacing: 4rpx;
}

.btn-loading {
  opacity: 0.7;
}

.loading-text {
  font-size: 28rpx;
}

/* 底部 */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
  gap: 8rpx;
}

.footer-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.footer-link {
  font-size: 24rpx;
  color: #FFD700;
}

/* 页面底部 */
.login-footer {
  position: absolute;
  bottom: 20rpx;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 1;
}

.copyright {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.3);
}
</style>
