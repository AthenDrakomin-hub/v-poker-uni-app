<template>
  <view class="workbench-page theme-agent">
    <!-- 背景 -->
    <view class="page-bg">
      <view class="bg-gradient"></view>
      <view class="bg-pattern"></view>
    </view>

    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">代理工作台</text>
      </view>
      <view class="nav-right">
        <view class="user-points glass-card">
          <text class="points-icon">💰</text>
          <text class="points-value">{{ formatPoints(userState.points) }}</text>
        </view>
      </view>
    </view>

    <!-- 主内容 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 收益概览卡片 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">收益概览</text>
          <text class="section-subtitle">今日数据</text>
        </view>
        <view class="stats-grid">
          <view class="stat-card glass-card" v-for="(stat, index) in statsData" :key="index">
            <view class="stat-icon" :style="{ background: stat.color }">
              <text>{{ stat.icon }}</text>
            </view>
            <view class="stat-info">
              <text class="stat-value">{{ stat.value }}</text>
              <text class="stat-label">{{ stat.label }}</text>
            </view>
            <view v-if="stat.trend" class="stat-trend" :class="stat.trend > 0 ? 'trend-up' : 'trend-down'">
              <text>{{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 收益趋势图 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">收益趋势</text>
          <view class="tab-group">
            <text
              v-for="tab in trendTabs"
              :key="tab.value"
              class="tab-item"
              :class="{ active: activeTrendTab === tab.value }"
              @click="activeTrendTab = tab.value"
            >{{ tab.label }}</text>
          </view>
        </view>
        <view class="chart-card glass-card">
          <view class="chart-container">
            <view
              v-for="(bar, index) in chartData"
              :key="index"
              class="chart-bar-wrapper"
            >
              <view class="chart-bar" :style="{ height: bar.height + '%', background: bar.color }">
                <text class="bar-value">{{ bar.value }}</text>
              </view>
              <text class="bar-label">{{ bar.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 玩家管理 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">玩家管理</text>
          <view class="header-actions">
            <view class="search-box">
              <text class="search-icon">🔍</text>
              <input class="search-input" v-model="searchKeyword" placeholder="搜索玩家" placeholder-class="search-placeholder" />
            </view>
            <view class="invite-btn" @click="showInviteCode = true">
              <text>邀请码</text>
            </view>
          </view>
        </view>
        <view class="player-list">
          <view
            v-for="player in filteredPlayers"
            :key="player.id"
            class="player-card glass-card"
            @click="showPlayerDetail(player)"
          >
            <view class="player-avatar" :style="{ background: getAvatarColor(player.nickname) }">
              <text class="avatar-text">{{ player.nickname?.charAt(0) || '?' }}</text>
            </view>
            <view class="player-info">
              <text class="player-name">{{ player.nickname }}</text>
              <text class="player-account">{{ player.account }}</text>
            </view>
            <view class="player-stats">
              <view class="stat-item">
                <text class="stat-num">{{ formatPoints(player.points) }}</text>
                <text class="stat-desc">筹码</text>
              </view>
              <view class="stat-item">
                <text class="stat-num">{{ player.gameCount || 0 }}</text>
                <text class="stat-desc">局数</text>
              </view>
            </view>
            <view class="player-actions">
              <view class="action-btn action-adjust" @click.stop="adjustPoints(player)">
                <text>调整</text>
              </view>
              <view v-if="!player.isAgent" class="action-btn action-promote" @click.stop="promotePlayer(player)">
                <text>升级</text>
              </view>
            </view>
          </view>
          <view v-if="filteredPlayers.length === 0" class="empty-state">
            <text class="empty-icon">👥</text>
            <text class="empty-text">暂无玩家</text>
          </view>
        </view>
      </view>

      <!-- 流水记录 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">流水记录</text>
          <text class="section-link" @click="loadMoreTransactions">查看更多</text>
        </view>
        <view class="transaction-list">
          <view
            v-for="(tx, index) in transactions"
            :key="index"
            class="transaction-item glass-card"
          >
            <view class="tx-icon" :class="tx.type">
              <text>{{ tx.icon }}</text>
            </view>
            <view class="tx-info">
              <text class="tx-title">{{ tx.title }}</text>
              <text class="tx-time">{{ tx.time }}</text>
            </view>
            <view class="tx-amount" :class="tx.amount > 0 ? 'amount-in' : 'amount-out'">
              <text>{{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-spacing"></view>
    </scroll-view>

    <!-- 邀请码弹窗 -->
    <view v-if="showInviteCode" class="modal-overlay" @click="showInviteCode = false">
      <view class="modal-content glass-card" @click.stop>
        <view class="modal-header">
          <text class="modal-title">我的邀请码</text>
          <text class="modal-close" @click="showInviteCode = false">✕</text>
        </view>
        <view class="invite-code-display">
          <text class="invite-code">{{ inviteCode }}</text>
          <view class="copy-btn" @click="copyInviteCode">
            <text>复制</text>
          </view>
        </view>
        <view class="invite-tip">
          <text>分享邀请码给玩家，玩家注册后自动成为您的下线</text>
        </view>
      </view>
    </view>

    <!-- 调整筹码弹窗 -->
    <view v-if="showAdjustModal" class="modal-overlay" @click="showAdjustModal = false">
      <view class="modal-content glass-card" @click.stop>
        <view class="modal-header">
          <text class="modal-title">调整筹码</text>
          <text class="modal-close" @click="showAdjustModal = false">✕</text>
        </view>
        <view class="adjust-player">
          <text class="adjust-name">{{ adjustTarget?.nickname }}</text>
          <text class="adjust-current">当前: {{ formatPoints(adjustTarget?.points || 0) }}</text>
        </view>
        <view class="adjust-form">
          <view class="form-group">
            <text class="form-label">调整数量</text>
            <view class="amount-input-group">
              <view class="amount-btn" @click="adjustAmount -= 10">-10</view>
              <input class="amount-input" type="number" v-model="adjustAmount" placeholder="输入数量" />
              <view class="amount-btn" @click="adjustAmount += 10">+10</view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">调整原因</text>
            <input class="form-input" v-model="adjustReason" placeholder="请输入原因" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-ghost" @click="showAdjustModal = false">取消</button>
          <button class="btn-primary" @click="confirmAdjust">确认调整</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userState, fetchUserInfo } from '../../store/user.js'
import { formatPoints, formatDateTime } from '../../utils/format.js'

export default {
  name: 'AgentWorkbench',
  data() {
    return {
      userState,
      searchKeyword: '',
      activeTrendTab: 'week',
      showInviteCode: false,
      showAdjustModal: false,
      adjustTarget: null,
      adjustAmount: 0,
      adjustReason: '',
      inviteCode: 'AGENT2026',
      trendTabs: [
        { label: '今日', value: 'today' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
      ],
      statsData: [
        { icon: '💰', label: '今日收益', value: '1,250', trend: 12.5, color: 'linear-gradient(135deg, #FFBF00, #FFA500)' },
        { icon: '👥', label: '在线玩家', value: '23', trend: 8.3, color: 'linear-gradient(135deg, #4ADE80, #22C55E)' },
        { icon: '🎮', label: '今日局数', value: '156', trend: -3.2, color: 'linear-gradient(135deg, #60A5FA, #3B82F6)' },
        { icon: '📊', label: '累计收益', value: '28,560', trend: 15.8, color: 'linear-gradient(135deg, #A78BFA, #8B5CF6)' },
      ],
      chartData: [
        { label: '周一', value: 320, height: 40, color: 'linear-gradient(180deg, #FFBF00, #FFA500)' },
        { label: '周二', value: 450, height: 56, color: 'linear-gradient(180deg, #FFBF00, #FFA500)' },
        { label: '周三', value: 380, height: 48, color: 'linear-gradient(180deg, #FFBF00, #FFA500)' },
        { label: '周四', value: 520, height: 65, color: 'linear-gradient(180deg, #FFBF00, #FFA500)' },
        { label: '周五', value: 680, height: 85, color: 'linear-gradient(180deg, #FFBF00, #FFA500)' },
        { label: '周六', value: 890, height: 100, color: 'linear-gradient(180deg, #FFD700, #FFBF00)' },
        { label: '周日', value: 750, height: 94, color: 'linear-gradient(180deg, #FFBF00, #FFA500)' },
      ],
      players: [
        { id: 1, nickname: '玩家小明', account: 'user001', points: 5200, gameCount: 45, isAgent: false },
        { id: 2, nickname: '玩家小红', account: 'user002', points: 3800, gameCount: 32, isAgent: false },
        { id: 3, nickname: '玩家小刚', account: 'user003', points: 8900, gameCount: 78, isAgent: true },
        { id: 4, nickname: '玩家小美', account: 'user004', points: 2100, gameCount: 18, isAgent: false },
        { id: 5, nickname: '玩家小华', account: 'user005', points: 6500, gameCount: 56, isAgent: false },
      ],
      transactions: [
        { id: 1, type: 'in', icon: '💰', title: '游戏抽水收益', time: '2026-08-25 14:30', amount: 150 },
        { id: 2, type: 'out', icon: '↩️', title: '调整玩家筹码', time: '2026-08-25 13:15', amount: -200 },
        { id: 3, type: 'in', icon: '💰', title: '游戏抽水收益', time: '2026-08-25 11:20', amount: 80 },
        { id: 4, type: 'in', icon: '🎁', title: '推广奖励', time: '2026-08-24 20:00', amount: 500 },
        { id: 5, type: 'out', icon: '↩️', title: '调整玩家筹码', time: '2026-08-24 18:30', amount: -100 },
      ],
    }
  },
  computed: {
    filteredPlayers() {
      if (!this.searchKeyword) return this.players
      const keyword = this.searchKeyword.toLowerCase()
      return this.players.filter(p =>
        p.nickname.toLowerCase().includes(keyword) ||
        p.account.toLowerCase().includes(keyword)
      )
    },
  },
  onLoad() {
    fetchUserInfo()
  },
  methods: {
    formatPoints,
    formatDateTime,
    goBack() {
      uni.navigateBack()
    },
    getAvatarColor(name) {
      const colors = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)',
      ]
      let hash = 0
      for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      return colors[Math.abs(hash) % colors.length]
    },
    showPlayerDetail(player) {
      uni.showToast({ title: `查看 ${player.nickname}`, icon: 'none' })
    },
    adjustPoints(player) {
      this.adjustTarget = player
      this.adjustAmount = 0
      this.adjustReason = ''
      this.showAdjustModal = true
    },
    async confirmAdjust() {
      if (!this.adjustReason.trim()) {
        uni.showToast({ title: '请输入调整原因', icon: 'none' })
        return
      }
      uni.showToast({ title: '调整成功', icon: 'success' })
      this.showAdjustModal = false
    },
    promotePlayer(player) {
      uni.showModal({
        title: '升级代理',
        content: `确定将 ${player.nickname} 升级为代理吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '升级成功', icon: 'success' })
          }
        }
      })
    },
    copyInviteCode() {
      uni.setClipboardData({
        data: this.inviteCode,
        success: () => {
          uni.showToast({ title: '已复制', icon: 'success' })
        }
      })
    },
    loadMoreTransactions() {
      uni.showToast({ title: '加载更多', icon: 'none' })
    },
  },
}
</script>

<style lang="scss" scoped>
.workbench-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

.theme-agent {
  --primary-color: #FFBF00;
  --primary-gradient: linear-gradient(135deg, #FFBF00, #FFA500);
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
  background: radial-gradient(ellipse at top right, rgba(255, 191, 0, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #1a1508 0%, #0a0a0a 100%);
}

.bg-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 20% 30%, rgba(255, 191, 0, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(255, 165, 0, 0.03) 0%, transparent 50%);
}

.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  background: rgba(26, 21, 8, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 191, 0, 0.1);
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
  color: #FFBF00;
}

.user-points {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.points-icon { font-size: 20rpx; }
.points-value { font-size: 24rpx; font-weight: 600; color: #FFBF00; }

.main-content {
  position: relative;
  z-index: 1;
  height: calc(100vh - 80rpx);
  padding: 24rpx;
}

.section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.section-subtitle {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 12rpx;
}

.section-link {
  font-size: 22rpx;
  color: #FFBF00;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 16rpx;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.stat-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

.stat-trend {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  font-size: 18rpx;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
}

.trend-up {
  color: #4ADE80;
  background: rgba(74, 222, 128, 0.1);
}

.trend-down {
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
}

/* 趋势图 */
.tab-group {
  display: flex;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.05);
  padding: 4rpx;
  border-radius: 8rpx;
}

.tab-item {
  padding: 8rpx 16rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 6rpx;
  transition: all 0.2s;
}

.tab-item.active {
  background: rgba(255, 191, 0, 0.2);
  color: #FFBF00;
}

.chart-card {
  padding: 24rpx;
  border-radius: 16rpx;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200rpx;
  gap: 8rpx;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar {
  width: 100%;
  max-width: 40rpx;
  border-radius: 6rpx 6rpx 0 0;
  position: relative;
  transition: height 0.5s ease;
  margin-top: auto;
}

.bar-value {
  position: absolute;
  top: -28rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16rpx;
  color: #FFBF00;
  white-space: nowrap;
}

.bar-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 8rpx;
}

/* 玩家管理 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
}

.search-icon {
  font-size: 20rpx;
  margin-right: 8rpx;
}

.search-input {
  width: 160rpx;
  font-size: 22rpx;
  color: #e8e8e8;
}

.search-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.invite-btn {
  padding: 8rpx 16rpx;
  background: rgba(255, 191, 0, 0.15);
  border: 1px solid rgba(255, 191, 0, 0.3);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #FFBF00;
}

.player-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.player-card {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-radius: 12rpx;
  gap: 16rpx;
}

.player-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}

.player-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.player-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.player-account {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
}

.player-stats {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 24rpx;
  font-weight: 600;
  color: #FFBF00;
}

.stat-desc {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
}

.player-actions {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.action-btn {
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 18rpx;
  text-align: center;
}

.action-adjust {
  background: rgba(255, 191, 0, 0.15);
  color: #FFBF00;
  border: 1px solid rgba(255, 191, 0, 0.3);
}

.action-promote {
  background: rgba(74, 222, 128, 0.15);
  color: #4ADE80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 60rpx;
  margin-bottom: 16rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* 流水记录 */
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-radius: 12rpx;
  gap: 16rpx;
}

.tx-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}

.tx-icon.in {
  background: rgba(74, 222, 128, 0.15);
}

.tx-icon.out {
  background: rgba(255, 107, 107, 0.15);
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.tx-title {
  font-size: 24rpx;
  color: #e8e8e8;
}

.tx-time {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

.tx-amount {
  font-size: 28rpx;
  font-weight: 700;
}

.amount-in {
  color: #4ADE80;
}

.amount-out {
  color: #FF6B6B;
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
  width: 80%;
  max-width: 600rpx;
  padding: 32rpx;
  border-radius: 20rpx;
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
  color: #FFBF00;
}

.modal-close {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 10rpx;
}

.invite-code-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 32rpx;
  background: rgba(255, 191, 0, 0.1);
  border: 2rpx dashed rgba(255, 191, 0, 0.4);
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.invite-code {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFBF00;
  letter-spacing: 4rpx;
}

.copy-btn {
  padding: 8rpx 20rpx;
  background: rgba(255, 191, 0, 0.2);
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #FFBF00;
}

.invite-tip {
  text-align: center;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

/* 调整筹码 */
.adjust-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.adjust-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.adjust-current {
  font-size: 22rpx;
  color: #FFBF00;
}

.adjust-form {
  margin-bottom: 24rpx;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12rpx;
}

.amount-input-group {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.amount-btn {
  padding: 12rpx 20rpx;
  background: rgba(255, 191, 0, 0.15);
  border: 1px solid rgba(255, 191, 0, 0.3);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #FFBF00;
}

.amount-input {
  flex: 1;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #e8e8e8;
  text-align: center;
}

.form-input {
  width: 100%;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
  color: #e8e8e8;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
}

.modal-footer .btn-ghost,
.modal-footer .btn-primary {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  border: none;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #e8e8e8;
}

.btn-primary {
  background: linear-gradient(135deg, #FFBF00, #FFA500);
  color: #1a1a1a;
  font-weight: 700;
}

/* 毛玻璃 */
.glass-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
