<template>
  <view class="cs-page theme-cs">
    <!-- 背景 -->
    <view class="page-bg">
      <view class="bg-gradient"></view>
    </view>

    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">客服工作台</text>
      </view>
      <view class="nav-right">
        <view class="online-badge">
          <view class="online-dot"></view>
          <text class="online-text">在线</text>
        </view>
      </view>
    </view>

    <!-- 主内容 -->
    <view class="main-content">
      <!-- 左侧：玩家列表 -->
      <view class="left-panel">
        <view class="panel-header">
          <text class="panel-title">玩家列表</text>
          <view class="search-box">
            <text class="search-icon">🔍</text>
            <input class="search-input" v-model="searchKeyword" placeholder="搜索账号/昵称" placeholder-class="search-placeholder" />
          </view>
        </view>
        <scroll-view class="player-list" scroll-y>
          <view
            v-for="player in filteredPlayers"
            :key="player.id"
            class="player-item"
            :class="{ active: selectedPlayer?.id === player.id }"
            @click="selectPlayer(player)"
          >
            <view class="player-avatar" :style="{ background: getAvatarColor(player.nickname) }">
              <text class="avatar-text">{{ player.nickname?.charAt(0) || '?' }}</text>
            </view>
            <view class="player-info">
              <view class="player-name-row">
                <text class="player-name">{{ player.nickname }}</text>
                <view class="status-dot" :class="player.isOnline ? 'online' : 'offline'"></view>
              </view>
              <text class="player-account">{{ player.account }}</text>
            </view>
            <view class="player-points">
              <text class="points-num">{{ formatPoints(player.points) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 右侧：玩家详情+操作流水 -->
      <view class="right-panel">
        <!-- 玩家详情 -->
        <view v-if="selectedPlayer" class="detail-section">
          <view class="detail-header">
            <view class="detail-avatar" :style="{ background: getAvatarColor(selectedPlayer.nickname) }">
              <text class="detail-avatar-text">{{ selectedPlayer.nickname?.charAt(0) || '?' }}</text>
            </view>
            <view class="detail-info">
              <text class="detail-name">{{ selectedPlayer.nickname }}</text>
              <text class="detail-account">{{ selectedPlayer.account }}</text>
              <view class="detail-tags">
                <text class="tag tag-role">{{ selectedPlayer.role === 'agent' ? '代理' : '玩家' }}</text>
                <text class="tag tag-status" :class="selectedPlayer.isOnline ? 'online' : 'offline'">
                  {{ selectedPlayer.isOnline ? '在线' : '离线' }}
                </text>
              </view>
            </view>
            <view class="detail-points">
              <text class="points-label">当前筹码</text>
              <text class="points-value">{{ formatPoints(selectedPlayer.points) }}</text>
            </view>
          </view>

          <!-- 快捷操作 -->
          <view class="quick-actions">
            <view class="action-card" @click="showAdjustModal = true">
              <text class="action-icon">💰</text>
              <text class="action-text">调整筹码</text>
            </view>
            <view class="action-card" @click="viewGameHistory">
              <text class="action-icon">🎮</text>
              <text class="action-text">游戏记录</text>
            </view>
            <view class="action-card" @click="viewLoginHistory">
              <text class="action-icon">📱</text>
              <text class="action-text">登录记录</text>
            </view>
            <view class="action-card action-danger" @click="freezePlayer">
              <text class="action-icon">🚫</text>
              <text class="action-text">冻结账号</text>
            </view>
          </view>
        </view>

        <!-- 未选择玩家提示 -->
        <view v-else class="empty-detail">
          <text class="empty-icon">👈</text>
          <text class="empty-text">请选择左侧玩家查看详情</text>
        </view>

        <!-- 操作流水时间线 -->
        <view class="timeline-section">
          <view class="timeline-header">
            <text class="timeline-title">操作流水</text>
            <view class="timeline-filter">
              <text
                v-for="filter in timelineFilters"
                :key="filter.value"
                class="filter-item"
                :class="{ active: activeFilter === filter.value }"
                @click="activeFilter = filter.value"
              >{{ filter.label }}</text>
            </view>
          </view>
          <scroll-view class="timeline-list" scroll-y>
            <view
              v-for="(record, index) in filteredTimeline"
              :key="index"
              class="timeline-item"
            >
              <view class="timeline-dot" :class="record.type"></view>
              <view class="timeline-line" v-if="index < filteredTimeline.length - 1"></view>
              <view class="timeline-content">
                <view class="timeline-top">
                  <text class="timeline-action">{{ record.action }}</text>
                  <text class="timeline-amount" :class="record.amount > 0 ? 'amount-in' : 'amount-out'">
                    {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
                  </text>
                </view>
                <view class="timeline-bottom">
                  <text class="timeline-operator">操作人: {{ record.operator }}</text>
                  <text class="timeline-time">{{ record.time }}</text>
                </view>
                <text v-if="record.reason" class="timeline-reason">原因: {{ record.reason }}</text>
              </view>
            </view>
            <view v-if="filteredTimeline.length === 0" class="empty-timeline">
              <text class="empty-text">暂无操作记录</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 调整筹码弹窗 -->
    <view v-if="showAdjustModal" class="modal-overlay" @click="showAdjustModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">调整玩家筹码</text>
          <text class="modal-close" @click="showAdjustModal = false">✕</text>
        </view>
        <view class="adjust-info">
          <text class="adjust-name">{{ selectedPlayer?.nickname }}</text>
          <text class="adjust-current">当前: {{ formatPoints(selectedPlayer?.points || 0) }}</text>
        </view>
        <view class="adjust-form">
          <view class="form-group">
            <text class="form-label">调整类型</text>
            <view class="type-group">
              <view class="type-btn" :class="{ active: adjustType === 'add' }" @click="adjustType = 'add'">
                <text>增加</text>
              </view>
              <view class="type-btn" :class="{ active: adjustType === 'deduct' }" @click="adjustType = 'deduct'">
                <text>扣除</text>
              </view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">调整数量</text>
            <input class="form-input" type="number" v-model="adjustAmount" placeholder="请输入数量" />
          </view>
          <view class="form-group">
            <text class="form-label">调整原因（必填）</text>
            <textarea class="form-textarea" v-model="adjustReason" placeholder="请详细说明调整原因，便于对账" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="showAdjustModal = false">取消</button>
          <button class="btn-confirm" @click="confirmAdjust">确认调整</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatPoints } from '../../utils/format.js'

export default {
  name: 'CustomerService',
  data() {
    return {
      searchKeyword: '',
      selectedPlayer: null,
      showAdjustModal: false,
      adjustType: 'add',
      adjustAmount: '',
      adjustReason: '',
      activeFilter: 'all',
      timelineFilters: [
        { label: '全部', value: 'all' },
        { label: '增加', value: 'add' },
        { label: '扣除', value: 'deduct' },
        { label: '冻结', value: 'freeze' },
      ],
      players: [
        { id: 1, nickname: '玩家小明', account: 'user001', points: 5200, role: 'player', isOnline: true },
        { id: 2, nickname: '玩家小红', account: 'user002', points: 3800, role: 'player', isOnline: false },
        { id: 3, nickname: '代理小刚', account: 'agent001', points: 8900, role: 'agent', isOnline: true },
        { id: 4, nickname: '玩家小美', account: 'user004', points: 2100, role: 'player', isOnline: true },
        { id: 5, nickname: '玩家小华', account: 'user005', points: 6500, role: 'player', isOnline: false },
        { id: 6, nickname: '玩家小强', account: 'user006', points: 1500, role: 'player', isOnline: true },
      ],
      timeline: [
        { id: 1, type: 'add', action: '增加筹码', amount: 500, operator: '客服A', time: '2026-08-25 14:30:25', reason: '玩家反馈充值未到账' },
        { id: 2, type: 'deduct', action: '扣除筹码', amount: -200, operator: '客服B', time: '2026-08-25 13:15:10', reason: '异常游戏行为扣除' },
        { id: 3, type: 'add', action: '增加筹码', amount: 1000, operator: '客服A', time: '2026-08-25 11:20:45', reason: '活动奖励发放' },
        { id: 4, type: 'freeze', action: '冻结账号', amount: 0, operator: '管理员', time: '2026-08-24 22:10:00', reason: '涉嫌作弊' },
        { id: 5, type: 'deduct', action: '扣除筹码', amount: -300, operator: '客服C', time: '2026-08-24 18:30:15', reason: '违规操作扣除' },
        { id: 6, type: 'add', action: '增加筹码', amount: 200, operator: '客服A', time: '2026-08-24 16:45:30', reason: '补偿掉线损失' },
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
    filteredTimeline() {
      if (this.activeFilter === 'all') return this.timeline
      return this.timeline.filter(t => t.type === this.activeFilter)
    },
  },
  methods: {
    formatPoints,
    goBack() {
      uni.navigateBack()
    },
    getAvatarColor(name) {
      const colors = [
        'linear-gradient(135deg, #4A5568, #2D3748)',
        'linear-gradient(135deg, #718096, #4A5568)',
        'linear-gradient(135deg, #A0AEC0, #718096)',
        'linear-gradient(135deg, #2D3748, #1A202C)',
      ]
      let hash = 0
      for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      return colors[Math.abs(hash) % colors.length]
    },
    selectPlayer(player) {
      this.selectedPlayer = player
    },
    viewGameHistory() {
      uni.showToast({ title: '查看游戏记录', icon: 'none' })
    },
    viewLoginHistory() {
      uni.showToast({ title: '查看登录记录', icon: 'none' })
    },
    freezePlayer() {
      uni.showModal({
        title: '冻结账号',
        content: `确定冻结 ${this.selectedPlayer?.nickname} 的账号吗？`,
        confirmColor: '#E53E3E',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已冻结', icon: 'success' })
          }
        }
      })
    },
    confirmAdjust() {
      if (!this.adjustAmount || parseInt(this.adjustAmount) <= 0) {
        uni.showToast({ title: '请输入有效数量', icon: 'none' })
        return
      }
      if (!this.adjustReason.trim()) {
        uni.showToast({ title: '请填写调整原因', icon: 'none' })
        return
      }
      uni.showToast({ title: '调整成功', icon: 'success' })
      this.showAdjustModal = false
      this.adjustAmount = ''
      this.adjustReason = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.cs-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0f1419;
}

.theme-cs {
  --primary-color: #4A5568;
  --accent-color: #63B3ED;
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
  background: linear-gradient(180deg, #1a202c 0%, #0f1419 100%);
}

.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72rpx;
  padding: 0 24rpx;
  background: rgba(26, 32, 44, 0.9);
  border-bottom: 1px solid rgba(99, 179, 237, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.back-btn {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.back-icon {
  font-size: 22rpx;
  color: #e8e8e8;
}

.nav-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #CBD5E0;
}

.online-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 16rpx;
  background: rgba(74, 222, 128, 0.1);
  border-radius: 20rpx;
}

.online-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #4ADE80;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.online-text {
  font-size: 20rpx;
  color: #4ADE80;
}

.main-content {
  position: relative;
  z-index: 1;
  display: flex;
  height: calc(100vh - 72rpx);
  padding: 16rpx;
  gap: 16rpx;
}

/* 左侧面板 */
.left-panel {
  width: 320rpx;
  display: flex;
  flex-direction: column;
  background: rgba(26, 32, 44, 0.6);
  border-radius: 12rpx;
  border: 1px solid rgba(99, 179, 237, 0.1);
  overflow: hidden;
}

.panel-header {
  padding: 16rpx;
  border-bottom: 1px solid rgba(99, 179, 237, 0.1);
}

.panel-title {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #CBD5E0;
  margin-bottom: 12rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8rpx;
  padding: 8rpx 12rpx;
}

.search-icon {
  font-size: 18rpx;
  margin-right: 8rpx;
}

.search-input {
  flex: 1;
  font-size: 20rpx;
  color: #e8e8e8;
}

.search-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.player-list {
  flex: 1;
  padding: 8rpx;
}

.player-item {
  display: flex;
  align-items: center;
  padding: 12rpx;
  border-radius: 8rpx;
  margin-bottom: 4rpx;
  gap: 10rpx;
  transition: all 0.2s;
}

.player-item.active {
  background: rgba(99, 179, 237, 0.15);
  border: 1px solid rgba(99, 179, 237, 0.3);
}

.player-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 20rpx;
  font-weight: 600;
  color: #fff;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.player-name {
  font-size: 22rpx;
  color: #e8e8e8;
  max-width: 100rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.online {
  background: #4ADE80;
}

.status-dot.offline {
  background: #6B7280;
}

.player-account {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
}

.player-points {
  flex-shrink: 0;
}

.points-num {
  font-size: 20rpx;
  font-weight: 600;
  color: #63B3ED;
}

/* 右侧面板 */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  overflow: hidden;
}

.detail-section {
  background: rgba(26, 32, 44, 0.6);
  border-radius: 12rpx;
  border: 1px solid rgba(99, 179, 237, 0.1);
  padding: 20rpx;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.detail-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-avatar-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.detail-info {
  flex: 1;
}

.detail-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #e8e8e8;
  margin-bottom: 4rpx;
}

.detail-account {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8rpx;
}

.detail-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 18rpx;
}

.tag-role {
  background: rgba(99, 179, 237, 0.15);
  color: #63B3ED;
}

.tag-status.online {
  background: rgba(74, 222, 128, 0.15);
  color: #4ADE80;
}

.tag-status.offline {
  background: rgba(107, 114, 128, 0.15);
  color: #9CA3AF;
}

.detail-points {
  text-align: right;
}

.points-label {
  display: block;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4rpx;
}

.points-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #63B3ED;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 8rpx;
  background: rgba(99, 179, 237, 0.08);
  border: 1px solid rgba(99, 179, 237, 0.2);
  border-radius: 8rpx;
  gap: 6rpx;
  transition: all 0.2s;
}

.action-card:active {
  transform: scale(0.95);
  background: rgba(99, 179, 237, 0.15);
}

.action-card.action-danger {
  background: rgba(229, 62, 62, 0.08);
  border-color: rgba(229, 62, 62, 0.2);
}

.action-icon {
  font-size: 28rpx;
}

.action-text {
  font-size: 18rpx;
  color: #CBD5E0;
}

.empty-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(26, 32, 44, 0.4);
  border-radius: 12rpx;
  border: 1px dashed rgba(99, 179, 237, 0.2);
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

/* 时间线 */
.timeline-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(26, 32, 44, 0.6);
  border-radius: 12rpx;
  border: 1px solid rgba(99, 179, 237, 0.1);
  overflow: hidden;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  border-bottom: 1px solid rgba(99, 179, 237, 0.1);
}

.timeline-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #CBD5E0;
}

.timeline-filter {
  display: flex;
  gap: 8rpx;
}

.filter-item {
  padding: 6rpx 14rpx;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 6rpx;
  transition: all 0.2s;
}

.filter-item.active {
  background: rgba(99, 179, 237, 0.15);
  color: #63B3ED;
}

.timeline-list {
  flex: 1;
  padding: 16rpx 20rpx;
}

.timeline-item {
  position: relative;
  display: flex;
  padding-left: 32rpx;
  padding-bottom: 20rpx;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 6rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  z-index: 1;
}

.timeline-dot.add {
  background: #4ADE80;
  box-shadow: 0 0 8rpx rgba(74, 222, 128, 0.5);
}

.timeline-dot.deduct {
  background: #F87171;
  box-shadow: 0 0 8rpx rgba(248, 113, 113, 0.5);
}

.timeline-dot.freeze {
  background: #FBBF24;
  box-shadow: 0 0 8rpx rgba(251, 191, 36, 0.5);
}

.timeline-line {
  position: absolute;
  left: 7rpx;
  top: 22rpx;
  width: 2rpx;
  height: calc(100% - 10rpx);
  background: rgba(99, 179, 237, 0.2);
}

.timeline-content {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
  padding: 12rpx 16rpx;
}

.timeline-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6rpx;
}

.timeline-action {
  font-size: 22rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.timeline-amount {
  font-size: 24rpx;
  font-weight: 700;
}

.amount-in {
  color: #4ADE80;
}

.amount-out {
  color: #F87171;
}

.timeline-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timeline-operator {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

.timeline-time {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.3);
}

.timeline-reason {
  display: block;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6rpx;
  padding-top: 6rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
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
  background: #1a202c;
  border-radius: 16rpx;
  border: 1px solid rgba(99, 179, 237, 0.2);
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
  color: #63B3ED;
}

.modal-close {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 10rpx;
}

.adjust-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: rgba(99, 179, 237, 0.08);
  border-radius: 8rpx;
  margin-bottom: 24rpx;
}

.adjust-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.adjust-current {
  font-size: 24rpx;
  color: #63B3ED;
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
  color: #CBD5E0;
  margin-bottom: 12rpx;
}

.type-group {
  display: flex;
  gap: 12rpx;
}

.type-btn {
  flex: 1;
  padding: 16rpx;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
}

.type-btn.active {
  background: rgba(99, 179, 237, 0.15);
  border-color: #63B3ED;
  color: #63B3ED;
}

.form-input {
  width: 100%;
  height: 72rpx;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #e8e8e8;
}

.form-textarea {
  width: 100%;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  padding: 12rpx 16rpx;
  font-size: 24rpx;
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
  border-radius: 8rpx;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #CBD5E0;
}

.btn-confirm {
  background: linear-gradient(135deg, #4A5568, #2D3748);
  color: #fff;
  font-weight: 600;
}
</style>
