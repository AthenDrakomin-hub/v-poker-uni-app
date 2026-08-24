<template>
  <view class="profile-page">
    <!-- 背景 -->
    <view class="page-bg">
      <view class="bg-gradient"></view>
      <view class="bg-glow"></view>
    </view>

    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">个人中心</text>
      </view>
      <view class="nav-right">
        <view class="settings-btn" @click="goToSettings">
          <text class="settings-icon">⚙️</text>
        </view>
      </view>
    </view>

    <!-- 主内容 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-avatar" :style="{ background: getAvatarColor(userState.nickname || 'U') }">
          <text class="avatar-text">{{ (userState.nickname || 'U').charAt(0) }}</text>
          <view class="avatar-badge" v-if="userState.role">
            <text class="badge-text">{{ getRoleText(userState.role) }}</text>
          </view>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userState.nickname || '未登录' }}</text>
          <text class="user-account">{{ userState.account || '请先登录' }}</text>
          <view class="user-meta">
            <text class="meta-item">ID: {{ userState.userId || '---' }}</text>
            <text class="meta-item">{{ userState.isOnline ? '在线' : '离线' }}</text>
          </view>
        </view>
        <view class="user-points">
          <text class="points-label">我的筹码</text>
          <text class="points-value">{{ formatPoints(userState.points || 0) }}</text>
          <view class="points-btn" @click="showRecharge = true">
            <text>充值</text>
          </view>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-section">
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ userStats.totalGames }}</text>
            <text class="stat-label">总局数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userStats.winRate }}%</text>
            <text class="stat-label">胜率</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ formatPoints(userStats.totalProfit) }}</text>
            <text class="stat-label">总盈亏</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userStats.maxWin }}</text>
            <text class="stat-label">最大连胜</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="menu-group">
          <text class="group-title">游戏相关</text>
          <view class="menu-list">
            <view class="menu-item" @click="viewGameHistory">
              <view class="menu-icon icon-blue">
                <text>🎮</text>
              </view>
              <text class="menu-name">游戏记录</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="menu-item" @click="viewTransactionHistory">
              <view class="menu-icon icon-green">
                <text>💰</text>
              </view>
              <text class="menu-name">筹码流水</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="menu-item" @click="viewInviteCode">
              <view class="menu-icon icon-purple">
                <text>🎁</text>
              </view>
              <text class="menu-name">我的邀请</text>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>

        <view class="menu-group">
          <text class="group-title">账号安全</text>
          <view class="menu-list">
            <view class="menu-item" @click="changePassword">
              <view class="menu-icon icon-orange">
                <text>🔐</text>
              </view>
              <text class="menu-name">修改密码</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="menu-item" @click="bindPhone">
              <view class="menu-icon icon-cyan">
                <text>📱</text>
              </view>
              <text class="menu-name">绑定手机</text>
              <view class="menu-tag" v-if="userState.phone">
                <text>已绑定</text>
              </view>
              <text class="menu-arrow" v-else>›</text>
            </view>
            <view class="menu-item" @click="viewLoginHistory">
              <view class="menu-icon icon-gray">
                <text>📋</text>
              </view>
              <text class="menu-name">登录记录</text>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>

        <view class="menu-group">
          <text class="group-title">其他</text>
          <view class="menu-list">
            <view class="menu-item" @click="aboutUs">
              <view class="menu-icon icon-indigo">
                <text>ℹ️</text>
              </view>
              <text class="menu-name">关于我们</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="menu-item" @click="userAgreement">
              <view class="menu-icon icon-teal">
                <text>📄</text>
              </view>
              <text class="menu-name">用户协议</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="menu-item" @click="contactService">
              <view class="menu-icon icon-pink">
                <text>💬</text>
              </view>
              <text class="menu-name">联系客服</text>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </view>

      <view class="bottom-spacing"></view>
    </scroll-view>

    <!-- 充值弹窗 -->
    <view v-if="showRecharge" class="modal-overlay" @click="showRecharge = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">筹码充值</text>
          <text class="modal-close" @click="showRecharge = false">✕</text>
        </view>
        <view class="recharge-tip">
          <text class="tip-text">请联系客服或代理进行充值</text>
        </view>
        <view class="recharge-amounts">
          <view
            v-for="(amount, index) in rechargeAmounts"
            :key="index"
            class="amount-card"
            :class="{ active: selectedAmount === index }"
            @click="selectedAmount = index"
          >
            <text class="amount-value">{{ amount }}</text>
            <text class="amount-unit">筹码</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="showRecharge = false">取消</button>
          <button class="btn-confirm" @click="confirmRecharge">联系充值</button>
        </view>
      </view>
    </view>

    <!-- 修改密码弹窗 -->
    <view v-if="showChangePassword" class="modal-overlay" @click="showChangePassword = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">修改密码</text>
          <text class="modal-close" @click="showChangePassword = false">✕</text>
        </view>
        <view class="password-form">
          <view class="form-group">
            <text class="form-label">原密码</text>
            <input class="form-input" type="password" v-model="passwordForm.oldPassword" placeholder="请输入原密码" />
          </view>
          <view class="form-group">
            <text class="form-label">新密码</text>
            <input class="form-input" type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码(6-20位)" />
          </view>
          <view class="form-group">
            <text class="form-label">确认新密码</text>
            <input class="form-input" type="password" v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="showChangePassword = false">取消</button>
          <button class="btn-confirm" @click="confirmChangePassword">确认修改</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userState, fetchUserInfo, logout } from '../../store/user.js'
import { formatPoints } from '../../utils/format.js'

export default {
  name: 'ProfilePage',
  data() {
    return {
      userState,
      showRecharge: false,
      showChangePassword: false,
      selectedAmount: 1,
      rechargeAmounts: [100, 500, 1000, 5000, 10000, 50000],
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      userStats: {
        totalGames: 156,
        winRate: 58.3,
        totalProfit: 12500,
        maxWin: 8,
      },
    }
  },
  onLoad() {
    fetchUserInfo()
  },
  methods: {
    formatPoints,
    goBack() {
      uni.navigateBack()
    },
    goToSettings() {
      uni.navigateTo({ url: '/pages/settings/settings' })
    },
    getAvatarColor(name) {
      const colors = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #30cfd0, #330867)',
      ]
      let hash = 0
      for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      return colors[Math.abs(hash) % colors.length]
    },
    getRoleText(role) {
      const roleMap = {
        player: '玩家',
        agent: '代理',
        general_agent: '总代理',
        customer_service: '客服',
        admin: '管理员',
      }
      return roleMap[role] || role
    },
    viewGameHistory() {
      uni.showToast({ title: '查看游戏记录', icon: 'none' })
    },
    viewTransactionHistory() {
      uni.showToast({ title: '查看筹码流水', icon: 'none' })
    },
    viewInviteCode() {
      uni.showToast({ title: '查看我的邀请', icon: 'none' })
    },
    changePassword() {
      this.showChangePassword = true
      this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' }
    },
    bindPhone() {
      uni.showToast({ title: '绑定手机', icon: 'none' })
    },
    viewLoginHistory() {
      uni.showToast({ title: '查看登录记录', icon: 'none' })
    },
    aboutUs() {
      uni.showModal({
        title: '关于V-Poker',
        content: 'V-Poker 2.0\n版本: 2.0.0\n一款专业的棋牌游戏平台',
        showCancel: false,
      })
    },
    userAgreement() {
      uni.showToast({ title: '查看用户协议', icon: 'none' })
    },
    contactService() {
      uni.showToast({ title: '联系客服', icon: 'none' })
    },
    confirmRecharge() {
      uni.showToast({ title: '请联系客服完成充值', icon: 'none' })
      this.showRecharge = false
    },
    confirmChangePassword() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm
      if (!oldPassword) {
        uni.showToast({ title: '请输入原密码', icon: 'none' })
        return
      }
      if (!newPassword || newPassword.length < 6) {
        uni.showToast({ title: '新密码至少6位', icon: 'none' })
        return
      }
      if (newPassword !== confirmPassword) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
      }
      uni.showToast({ title: '密码修改成功', icon: 'success' })
      this.showChangePassword = false
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
.profile-page {
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

.bg-glow {
  position: absolute;
  top: -100rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
}

.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.settings-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.settings-icon {
  font-size: 24rpx;
}

.main-content {
  position: relative;
  z-index: 1;
  height: calc(100vh - 80rpx);
  padding: 20rpx;
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  gap: 20rpx;
}

.user-avatar {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.avatar-badge {
  position: absolute;
  bottom: -4rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 2rpx 12rpx;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 10rpx;
  white-space: nowrap;
}

.badge-text {
  font-size: 16rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #e8e8e8;
  margin-bottom: 4rpx;
}

.user-account {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8rpx;
}

.user-meta {
  display: flex;
  gap: 16rpx;
}

.meta-item {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

.user-points {
  text-align: right;
  flex-shrink: 0;
}

.points-label {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4rpx;
}

.points-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #FFD700;
  font-family: Georgia, serif;
  margin-bottom: 8rpx;
}

.points-btn {
  display: inline-block;
  padding: 6rpx 20rpx;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 16rpx;
}

.points-btn text {
  font-size: 20rpx;
  font-weight: 600;
  color: #1a1a1a;
}

/* 统计 */
.stats-section {
  margin-bottom: 20rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* 菜单 */
.menu-section {
  margin-bottom: 20rpx;
}

.menu-group {
  margin-bottom: 20rpx;
}

.group-title {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10rpx;
  padding-left: 8rpx;
}

.menu-list {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  gap: 16rpx;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: rgba(255, 255, 255, 0.05);
}

.menu-icon {
  width: 44rpx;
  height: 44rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  flex-shrink: 0;
}

.icon-blue { background: rgba(66, 153, 225, 0.15); }
.icon-green { background: rgba(72, 187, 120, 0.15); }
.icon-purple { background: rgba(159, 122, 234, 0.15); }
.icon-orange { background: rgba(237, 137, 54, 0.15); }
.icon-cyan { background: rgba(56, 178, 172, 0.15); }
.icon-gray { background: rgba(113, 128, 150, 0.15); }
.icon-indigo { background: rgba(102, 126, 234, 0.15); }
.icon-teal { background: rgba(20, 184, 166, 0.15); }
.icon-pink { background: rgba(236, 72, 153, 0.15); }

.menu-name {
  flex: 1;
  font-size: 26rpx;
  color: #e8e8e8;
}

.menu-tag {
  padding: 4rpx 12rpx;
  background: rgba(72, 187, 120, 0.15);
  border-radius: 8rpx;
}

.menu-tag text {
  font-size: 18rpx;
  color: #48BB78;
}

.menu-arrow {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.3);
}

/* 退出登录 */
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

/* 弹窗 */
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
  max-height: 85vh;
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

.recharge-tip {
  padding: 16rpx;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.tip-text {
  font-size: 22rpx;
  color: #FFD700;
}

.recharge-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.amount-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 8rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  transition: all 0.2s;
}

.amount-card.active {
  background: rgba(255, 215, 0, 0.15);
  border-color: #FFD700;
}

.amount-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.amount-card.active .amount-value {
  color: #FFD700;
}

.amount-unit {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

.password-form {
  margin-bottom: 24rpx;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  font-size: 24rpx;
  color: #CBD5E0;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 72rpx;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
  color: #e8e8e8;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #CBD5E0;
}

.btn-confirm {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a1a;
  font-weight: 700;
}
</style>
