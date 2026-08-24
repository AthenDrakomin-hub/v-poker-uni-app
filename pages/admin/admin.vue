<template>
  <view class="admin-page theme-admin">
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
        <text class="nav-title">管理后台</text>
      </view>
      <view class="nav-right">
        <view class="admin-badge">
          <text class="badge-icon">⚙️</text>
          <text class="badge-text">管理员</text>
        </view>
      </view>
    </view>

    <!-- 主内容 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 全局数据概览 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">全局概览</text>
          <text class="section-time">{{ currentTime }}</text>
        </view>
        <view class="stats-grid">
          <view class="stat-card" v-for="(stat, index) in globalStats" :key="index">
            <view class="stat-icon" :style="{ background: stat.color }">
              <text>{{ stat.icon }}</text>
            </view>
            <view class="stat-content">
              <text class="stat-value">{{ stat.value }}</text>
              <text class="stat-label">{{ stat.label }}</text>
            </view>
            <view class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
              <text>{{ stat.trend > 0 ? '↑' : '↓' }}{{ Math.abs(stat.trend) }}%</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">功能管理</text>
        </view>
        <view class="menu-grid">
          <view
            v-for="(menu, index) in adminMenus"
            :key="index"
            class="menu-card"
            @click="handleMenuClick(menu)"
          >
            <view class="menu-icon" :style="{ background: menu.color }">
              <text>{{ menu.icon }}</text>
            </view>
            <text class="menu-name">{{ menu.name }}</text>
            <text class="menu-desc">{{ menu.desc }}</text>
            <view v-if="menu.badge" class="menu-badge">
              <text>{{ menu.badge }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 实时在线房间 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">在线房间</text>
          <text class="section-link" @click="viewAllRooms">全部房间</text>
        </view>
        <view class="room-list">
          <view
            v-for="room in onlineRooms"
            :key="room.id"
            class="room-card"
          >
            <view class="room-info">
              <view class="room-header">
                <text class="room-name">{{ room.name }}</text>
                <view class="room-status" :class="room.status">
                  <text>{{ room.status === 'playing' ? '游戏中' : '等待中' }}</text>
                </view>
              </view>
              <view class="room-meta">
                <text class="meta-item">{{ room.gameType }}</text>
                <text class="meta-item">{{ room.playerCount }}/{{ room.maxPlayers }}人</text>
                <text class="meta-item">底注{{ room.ante }}</text>
              </view>
            </view>
            <view class="room-actions">
              <view class="action-btn" @click="viewRoomDetail(room)">
                <text>详情</text>
              </view>
              <view class="action-btn action-danger" @click="dissolveRoom(room)">
                <text>解散</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 审计日志 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">审计日志</text>
          <view class="log-filter">
            <text
              v-for="filter in logFilters"
              :key="filter.value"
              class="filter-item"
              :class="{ active: activeLogFilter === filter.value }"
              @click="activeLogFilter = filter.value"
            >{{ filter.label }}</text>
          </view>
        </view>
        <view class="log-list">
          <view
            v-for="(log, index) in filteredLogs"
            :key="index"
            class="log-item"
          >
            <view class="log-type" :class="log.type">
              <text>{{ log.typeIcon }}</text>
            </view>
            <view class="log-content">
              <view class="log-top">
                <text class="log-action">{{ log.action }}</text>
                <text class="log-time">{{ log.time }}</text>
              </view>
              <text class="log-detail">{{ log.detail }}</text>
              <view class="log-meta">
                <text class="log-operator">操作人: {{ log.operator }}</text>
                <text class="log-ip">IP: {{ log.ip }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 系统状态 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">系统状态</text>
        </view>
        <view class="system-status">
          <view class="status-item" v-for="(status, index) in systemStatus" :key="index">
            <view class="status-header">
              <text class="status-name">{{ status.name }}</text>
              <view class="status-indicator" :class="status.status">
                <view class="indicator-dot"></view>
                <text class="indicator-text">{{ status.status === 'normal' ? '正常' : '异常' }}</text>
              </view>
            </view>
            <view class="status-bar">
              <view class="bar-fill" :style="{ width: status.usage + '%', background: status.usage > 80 ? '#F87171' : '#4ADE80' }"></view>
            </view>
            <text class="status-usage">使用率: {{ status.usage }}%</text>
          </view>
        </view>
      </view>

      <view class="bottom-spacing"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      currentTime: '',
      activeLogFilter: 'all',
      logFilters: [
        { label: '全部', value: 'all' },
        { label: '用户', value: 'user' },
        { label: '房间', value: 'room' },
        { label: '系统', value: 'system' },
        { label: '财务', value: 'finance' },
      ],
      globalStats: [
        { icon: '👥', label: '总用户', value: '12,580', trend: 5.2, color: 'linear-gradient(135deg, #4A5568, #2D3748)' },
        { icon: '🎮', label: '在线玩家', value: '326', trend: 12.8, color: 'linear-gradient(135deg, #48BB78, #38A169)' },
        { icon: '🏠', label: '在线房间', value: '48', trend: 8.3, color: 'linear-gradient(135deg, #4299E1, #3182CE)' },
        { icon: '💰', label: '今日流水', value: '258.6K', trend: 15.6, color: 'linear-gradient(135deg, #ED8936, #DD6B20)' },
        { icon: '📊', label: '今日抽水', value: '7,758', trend: 15.6, color: 'linear-gradient(135deg, #9F7AEA, #805AD5)' },
        { icon: '⚠️', label: '异常事件', value: '3', trend: -25, color: 'linear-gradient(135deg, #F56565, #E53E3E)' },
      ],
      adminMenus: [
        { name: '用户管理', desc: '用户列表/冻结/调整', icon: '👥', color: 'linear-gradient(135deg, #4299E1, #3182CE)', badge: null, action: 'users' },
        { name: '房间管理', desc: '房间列表/解散/监控', icon: '🏠', color: 'linear-gradient(135deg, #48BB78, #38A169)', badge: '48', action: 'rooms' },
        { name: '代理管理', desc: '代理层级/返佣配置', icon: '🤝', color: 'linear-gradient(135deg, #9F7AEA, #805AD5)', badge: null, action: 'agents' },
        { name: '财务中心', desc: '流水/抽水/对账', icon: '💰', color: 'linear-gradient(135deg, #ED8936, #DD6B20)', badge: null, action: 'finance' },
        { name: '审计日志', desc: '操作记录/安全审计', icon: '📋', color: 'linear-gradient(135deg, #4A5568, #2D3748)', badge: null, action: 'audit' },
        { name: '系统配置', desc: '参数/规则/公告', icon: '⚙️', color: 'linear-gradient(135deg, #718096, #4A5568)', badge: null, action: 'config' },
      ],
      onlineRooms: [
        { id: 1, name: 'VIP房001', gameType: '抢庄牛牛', playerCount: 6, maxPlayers: 6, ante: 10, status: 'playing', creator: '代理A' },
        { id: 2, name: '休闲房002', gameType: '炸金花', playerCount: 4, maxPlayers: 6, ante: 5, status: 'playing', creator: '玩家小明' },
        { id: 3, name: '高手房003', gameType: '德州扑克', playerCount: 5, maxPlayers: 6, ante: 20, status: 'waiting', creator: '代理B' },
        { id: 4, name: '新手房004', gameType: '通比牛牛', playerCount: 3, maxPlayers: 6, ante: 2, status: 'playing', creator: '玩家小红' },
      ],
      auditLogs: [
        { id: 1, type: 'user', typeIcon: '👤', action: '冻结用户账号', detail: '冻结用户 user001（玩家小明），原因：涉嫌作弊', operator: 'admin', time: '2026-08-25 14:32:15', ip: '192.168.1.100' },
        { id: 2, type: 'room', typeIcon: '🏠', action: '解散房间', detail: '强制解散房间 VIP房088，原因：违规行为', operator: 'admin', time: '2026-08-25 13:45:22', ip: '192.168.1.100' },
        { id: 3, type: 'finance', typeIcon: '💰', action: '调整筹码', detail: '为用户 user002 增加筹码 500，原因：充值补偿', operator: '客服A', time: '2026-08-25 12:20:08', ip: '192.168.1.101' },
        { id: 4, type: 'system', typeIcon: '⚙️', action: '修改系统配置', detail: '修改抽水比例为 3%', operator: 'admin', time: '2026-08-25 10:15:30', ip: '192.168.1.100' },
        { id: 5, type: 'user', typeIcon: '👤', action: '用户注册', detail: '新用户注册：user099（玩家小刚），邀请人：代理A', operator: 'system', time: '2026-08-25 09:30:45', ip: '192.168.1.200' },
      ],
      systemStatus: [
        { name: 'API服务器', status: 'normal', usage: 45 },
        { name: '数据库', status: 'normal', usage: 62 },
        { name: 'WebSocket服务', status: 'normal', usage: 38 },
        { name: '内存使用', status: 'normal', usage: 71 },
      ],
    }
  },
  computed: {
    filteredLogs() {
      if (this.activeLogFilter === 'all') return this.auditLogs
      return this.auditLogs.filter(log => log.type === this.activeLogFilter)
    },
  },
  onLoad() {
    this.updateTime()
    this.timeInterval = setInterval(() => {
      this.updateTime()
    }, 1000)
  },
  onUnload() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
    goBack() {
      uni.navigateBack()
    },
    handleMenuClick(menu) {
      uni.showToast({ title: `进入${menu.name}`, icon: 'none' })
    },
    viewAllRooms() {
      uni.showToast({ title: '查看全部房间', icon: 'none' })
    },
    viewRoomDetail(room) {
      uni.showToast({ title: `查看 ${room.name}`, icon: 'none' })
    },
    dissolveRoom(room) {
      uni.showModal({
        title: '解散房间',
        content: `确定强制解散房间 ${room.name} 吗？`,
        confirmColor: '#E53E3E',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已解散', icon: 'success' })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.admin-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0e14;
}

.theme-admin {
  --primary-color: #4A5568;
  --accent-color: #718096;
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
  background: linear-gradient(180deg, #1a202c 0%, #0a0e14 100%);
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
  border-bottom: 1px solid rgba(113, 128, 150, 0.2);
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

.admin-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 16rpx;
  background: rgba(113, 128, 150, 0.2);
  border: 1px solid rgba(113, 128, 150, 0.3);
  border-radius: 20rpx;
}

.badge-icon {
  font-size: 20rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #A0AEC0;
  font-weight: 600;
}

.main-content {
  position: relative;
  z-index: 1;
  height: calc(100vh - 72rpx);
  padding: 20rpx;
}

.section {
  margin-bottom: 28rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.section-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #E2E8F0;
}

.section-time {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
  font-family: monospace;
}

.section-link {
  font-size: 20rpx;
  color: #63B3ED;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 14rpx;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(113, 128, 150, 0.15);
  border-radius: 10rpx;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  border-radius: 8rpx;
  margin-right: 10rpx;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24rpx;
  font-weight: 700;
  color: #E2E8F0;
}

.stat-label {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
}

.stat-trend {
  position: absolute;
  top: 6rpx;
  right: 6rpx;
  font-size: 14rpx;
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}

.stat-trend.up {
  color: #48BB78;
  background: rgba(72, 187, 120, 0.1);
}

.stat-trend.down {
  color: #F56565;
  background: rgba(245, 101, 101, 0.1);
}

/* 功能菜单 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.menu-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 12rpx;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(113, 128, 150, 0.15);
  border-radius: 12rpx;
  gap: 8rpx;
  transition: all 0.2s;
}

.menu-card:active {
  transform: scale(0.96);
  background: rgba(45, 55, 72, 0.8);
}

.menu-icon {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  border-radius: 12rpx;
}

.menu-name {
  font-size: 22rpx;
  font-weight: 600;
  color: #E2E8F0;
}

.menu-desc {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.menu-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  min-width: 32rpx;
  height: 28rpx;
  padding: 0 8rpx;
  background: #F56565;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-badge text {
  font-size: 16rpx;
  color: #fff;
  font-weight: 600;
}

/* 房间列表 */
.room-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.room-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 16rpx;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(113, 128, 150, 0.15);
  border-radius: 10rpx;
}

.room-info {
  flex: 1;
}

.room-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 6rpx;
}

.room-name {
  font-size: 22rpx;
  font-weight: 600;
  color: #E2E8F0;
}

.room-status {
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
  font-size: 16rpx;
}

.room-status.playing {
  background: rgba(72, 187, 120, 0.15);
  color: #48BB78;
}

.room-status.waiting {
  background: rgba(237, 137, 54, 0.15);
  color: #ED8936;
}

.room-meta {
  display: flex;
  gap: 16rpx;
}

.meta-item {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
}

.room-actions {
  display: flex;
  gap: 8rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  background: rgba(99, 179, 237, 0.15);
  border: 1px solid rgba(99, 179, 237, 0.3);
  border-radius: 6rpx;
  font-size: 18rpx;
  color: #63B3ED;
}

.action-btn.action-danger {
  background: rgba(245, 101, 101, 0.15);
  border-color: rgba(245, 101, 101, 0.3);
  color: #F56565;
}

/* 审计日志 */
.log-filter {
  display: flex;
  gap: 6rpx;
}

.filter-item {
  padding: 6rpx 12rpx;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 4rpx;
  transition: all 0.2s;
}

.filter-item.active {
  background: rgba(113, 128, 150, 0.2);
  color: #A0AEC0;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.log-item {
  display: flex;
  gap: 12rpx;
  padding: 14rpx;
  background: rgba(45, 55, 72, 0.4);
  border: 1px solid rgba(113, 128, 150, 0.1);
  border-radius: 10rpx;
}

.log-type {
  width: 40rpx;
  height: 40rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18rpx;
  flex-shrink: 0;
}

.log-type.user {
  background: rgba(66, 153, 225, 0.15);
}

.log-type.room {
  background: rgba(72, 187, 120, 0.15);
}

.log-type.system {
  background: rgba(113, 128, 150, 0.15);
}

.log-type.finance {
  background: rgba(237, 137, 54, 0.15);
}

.log-content {
  flex: 1;
  min-width: 0;
}

.log-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4rpx;
}

.log-action {
  font-size: 20rpx;
  font-weight: 600;
  color: #E2E8F0;
}

.log-time {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.3);
  font-family: monospace;
}

.log-detail {
  display: block;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6rpx;
  line-height: 1.4;
}

.log-meta {
  display: flex;
  gap: 16rpx;
}

.log-operator,
.log-ip {
  font-size: 14rpx;
  color: rgba(255, 255, 255, 0.3);
}

/* 系统状态 */
.system-status {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.status-item {
  padding: 14rpx 16rpx;
  background: rgba(45, 55, 72, 0.4);
  border: 1px solid rgba(113, 128, 150, 0.1);
  border-radius: 10rpx;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.status-name {
  font-size: 20rpx;
  color: #E2E8F0;
  font-weight: 600;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.indicator-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
}

.status-indicator.normal .indicator-dot {
  background: #48BB78;
  box-shadow: 0 0 6rpx rgba(72, 187, 120, 0.5);
}

.status-indicator.error .indicator-dot {
  background: #F56565;
  box-shadow: 0 0 6rpx rgba(245, 101, 101, 0.5);
}

.indicator-text {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.5);
}

.status-bar {
  height: 8rpx;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 6rpx;
}

.bar-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.status-usage {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
}

.bottom-spacing {
  height: 40rpx;
}
</style>
