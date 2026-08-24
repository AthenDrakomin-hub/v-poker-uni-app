<template>
  <view class="lobby-page">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="bg-gradient"></view>
      <view class="bg-vignette"></view>
    </view>

    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-left">
        <view class="nav-logo">
          <text class="logo-icon">V</text>
          <text class="logo-text gold-text">V-POKER</text>
        </view>
      </view>

      <view class="nav-center">
        <view class="nav-tabs">
          <view
            class="nav-tab"
            :class="{ active: activeTab === 'rooms' }"
            @click="activeTab = 'rooms'"
          >
            <text>房间大厅</text>
          </view>
          <view
            class="nav-tab"
            :class="{ active: activeTab === 'mine' }"
            @click="activeTab = 'mine'"
          >
            <text>我的房间</text>
          </view>
        </view>
      </view>

      <view class="nav-right">
        <!-- 筹码余额 -->
        <view class="user-points glass-card">
          <text class="points-icon">💰</text>
          <text class="points-value gold-text">{{ formatPoints(userState.points) }}</text>
        </view>

        <!-- 用户头像 -->
        <view class="user-avatar" @click="goProfile">
          <view class="avatar-circle">
            <text class="avatar-text">{{ userState.nickname?.charAt(0) || 'U' }}</text>
          </view>
          <view class="user-info">
            <text class="user-name">{{ userState.nickname || userState.account }}</text>
            <text class="user-role">{{ formatRole(userState.role) }}</text>
          </view>
        </view>

        <!-- 工作台入口 -->
        <view v-if="isAgentOrAbove" class="workbench-entry" @click="goWorkbench">
          <text class="entry-icon">📊</text>
          <text class="entry-text">工作台</text>
        </view>
      </view>
    </view>

    <!-- 主内容区 -->
    <view class="lobby-content">
      <!-- 左侧游戏选择 -->
      <view class="game-selector">
        <view class="selector-title">
          <text class="title-text">选择游戏</text>
        </view>
        <view class="game-list">
          <view
            v-for="game in gameTypes"
            :key="game.id"
            class="game-card"
            :class="{ active: selectedGame === game.id }"
            :style="{ '--game-color': game.color }"
            @click="selectGame(game.id)"
          >
            <view class="game-icon" :style="{ background: game.gradient }">
              <text class="icon-text">{{ game.icon }}</text>
            </view>
            <view class="game-info">
              <text class="game-name">{{ game.name }}</text>
              <text class="game-desc">{{ game.desc }}</text>
            </view>
            <view v-if="selectedGame === game.id" class="game-check">
              <text>✓</text>
            </view>
          </view>
        </view>

        <!-- 创建房间按钮 -->
        <view class="create-room-btn" @click="createRoom">
          <text class="btn-icon">+</text>
          <text class="btn-text">创建房间</text>
        </view>
      </view>

      <!-- 右侧房间列表 -->
      <view class="room-list-section">
        <view class="section-header">
          <text class="section-title">{{ activeTab === 'rooms' ? '房间列表' : '我的房间' }}</text>
          <view class="section-actions">
            <view class="refresh-btn" @click="loadRooms">
              <text class="refresh-icon" :class="{ spinning: isLoading }">🔄</text>
            </view>
          </view>
        </view>

        <!-- 房间列表 -->
        <scroll-view class="room-list" scroll-y>
          <view v-if="rooms.length === 0 && !isLoading" class="empty-state">
            <text class="empty-icon">🎴</text>
            <text class="empty-text">暂无房间</text>
            <text class="empty-hint">点击左侧"创建房间"开始游戏</text>
          </view>

          <view
            v-for="room in rooms"
            :key="room.id"
            class="room-card glass-card"
            @click="joinRoom(room)"
          >
            <view class="room-header">
              <view class="room-game-tag" :style="{ background: getGameColor(room.gameType) }">
                <text>{{ formatGameType(room.gameType) }}</text>
              </view>
              <view class="room-status" :class="room.status">
                <text>{{ room.status === 'playing' ? '游戏中' : '等待中' }}</text>
              </view>
            </view>

            <view class="room-body">
              <view class="room-info">
                <text class="room-name">{{ room.name || '房间#' + room.id }}</text>
                <view class="room-meta">
                  <text class="meta-item">底注: {{ room.baseBet }}</text>
                  <text class="meta-item">{{ room.playerCount }}/{{ room.maxPlayers }}人</text>
                </view>
              </view>
              <view class="room-owner">
                <text class="owner-label">房主</text>
                <text class="owner-name">{{ room.ownerName || '未知' }}</text>
              </view>
            </view>

            <view class="room-footer">
              <view class="room-players">
                <view
                  v-for="i in Math.min(room.playerCount, 5)"
                  :key="i"
                  class="player-dot"
                ></view>
              </view>
              <view class="join-btn">
                <text>加入</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 创建房间弹窗 -->
    <view v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <view class="modal-content glass-card" @click.stop>
        <view class="modal-header">
          <text class="modal-title">创建房间</text>
          <text class="modal-close" @click="showCreateModal = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">游戏类型</text>
            <view class="game-type-display">
              <text class="game-type-name">{{ currentGameInfo.name }}</text>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">底注</text>
            <view class="bet-options">
              <view
                v-for="bet in betOptions"
                :key="bet"
                class="bet-option"
                :class="{ active: createForm.baseBet === bet }"
                @click="createForm.baseBet = bet"
              >
                <text>{{ bet }}</text>
              </view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">最大人数</text>
            <view class="player-options">
              <view
                v-for="num in [4, 5, 6]"
                :key="num"
                class="player-option"
                :class="{ active: createForm.maxPlayers === num }"
                @click="createForm.maxPlayers = num"
              >
                <text>{{ num }}人</text>
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-ghost" @click="showCreateModal = false">取消</button>
          <button class="btn-primary" :disabled="isCreating" @click="confirmCreateRoom">
            {{ isCreating ? '创建中...' : '确认创建' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userState, fetchUserInfo, isAgentOrAbove, logout } from '../../store/user.js'
import { formatPoints, formatGameType, formatRole } from '../../utils/format.js'
import { getMyRooms, getRoomList, createRoom as apiCreateRoom, joinRoom as apiJoinRoom } from '../../api/rooms.js'

export default {
  data() {
    return {
      userState,
      activeTab: 'rooms',
      selectedGame: 'niuniu',
      rooms: [],
      isLoading: false,
      showCreateModal: false,
      isCreating: false,
      createForm: {
        baseBet: 10,
        maxPlayers: 6,
      },
      gameTypes: [
        { id: 'niuniu', name: '抢庄牛牛', desc: '庄闲对抗 · 极速博弈', icon: '🐂', color: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700, #FFA500)' },
        { id: 'sangong', name: '抢庄三公', desc: '三张定乾坤 · 水墨意境', icon: '🎴', color: '#4A90A4', gradient: 'linear-gradient(135deg, #4A90A4, #2C5F6D)' },
        { id: 'tbnn', name: '通比牛牛', desc: '无庄家 · 全自动比牌', icon: '⚙️', color: '#CD7F32', gradient: 'linear-gradient(135deg, #CD7F32, #8B4513)' },
        { id: 'jinhua', name: '炸金花', desc: '心理战 · 隐蔽博弈', icon: '🃏', color: '#FFD700', gradient: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)' },
        { id: 'texas', name: '德州扑克', desc: '数学赔率 · 理性竞技', icon: '♠', color: '#00D4FF', gradient: 'linear-gradient(135deg, #00D4FF, #0099CC)' },
      ],
      betOptions: [5, 10, 20, 50, 100],
    }
  },
  computed: {
    currentGameInfo() {
      return this.gameTypes.find(g => g.id === this.selectedGame) || this.gameTypes[0]
    },
    isAgentOrAbove() {
      return isAgentOrAbove()
    },
  },
  onLoad() {
    this.init()
  },
  onShow() {
    // 刷新用户信息
    this.loadUserInfo()
    this.loadRooms()
  },
  methods: {
    formatPoints,
    formatGameType,
    formatRole,

    // 初始化
    async init() {
      await this.loadUserInfo()
      await this.loadRooms()
    },

    // 加载用户信息
    async loadUserInfo() {
      try {
        await fetchUserInfo()
      } catch (e) {
        // Token失效，跳转登录
        if (e.statusCode === 401) {
          uni.reLaunch({ url: '/pages/login/login' })
        }
      }
    },

    // 加载房间列表
    async loadRooms() {
      this.isLoading = true
      try {
        if (this.activeTab === 'mine') {
          const data = await getMyRooms()
          this.rooms = data.rooms || data || []
        } else {
          const data = await getRoomList({ gameType: this.selectedGame })
          this.rooms = data.rooms || data || []
        }
      } catch (e) {
        console.error('[Lobby] 加载房间失败', e)
      } finally {
        this.isLoading = false
      }
    },

    // 选择游戏
    selectGame(gameId) {
      this.selectedGame = gameId
      if (this.activeTab === 'rooms') {
        this.loadRooms()
      }
    },

    // 获取游戏颜色
    getGameColor(gameType) {
      const game = this.gameTypes.find(g => g.id === gameType)
      return game ? game.gradient : 'linear-gradient(135deg, #666, #333)'
    },

    // 创建房间
    createRoom() {
      this.showCreateModal = true
    },

    // 确认创建房间
    async confirmCreateRoom() {
      this.isCreating = true
      try {
        const data = await apiCreateRoom(this.selectedGame, {
          baseBet: this.createForm.baseBet,
          maxPlayers: this.createForm.maxPlayers,
        })

        uni.showToast({
          title: '房间创建成功',
          icon: 'success',
        })

        this.showCreateModal = false

        // 跳转到房间
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/room/room?id=${data.roomId || data.id}`,
          })
        }, 1000)
      } catch (e) {
        uni.showToast({
          title: e.error || '创建失败',
          icon: 'none',
        })
      } finally {
        this.isCreating = false
      }
    },

    // 加入房间
    async joinRoom(room) {
      try {
        await apiJoinRoom(room.id)
        uni.navigateTo({
          url: `/pages/room/room?id=${room.id}`,
        })
      } catch (e) {
        uni.showToast({
          title: e.error || '加入失败',
          icon: 'none',
        })
      }
    },

    // 去个人中心
    goProfile() {
      uni.navigateTo({ url: '/pages/profile/profile' })
    },

    // 去工作台
    goWorkbench() {
      const role = userState.role
      let url = '/pages/workbench/workbench'
      if (role === 'customer_service') {
        url = '/pages/customer-service/customer-service'
      } else if (role === 'general_agent') {
        url = '/pages/promotion/promotion'
      } else if (role === 'admin') {
        url = '/pages/admin/admin'
      }
      uni.navigateTo({ url })
    },
  },
}
</script>

<style lang="scss">
.lobby-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* 背景 */
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
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 20% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(107, 70, 193, 0.04) 0%, transparent 40%),
              linear-gradient(180deg, #0a0a0a 0%, #111 100%);
}

.bg-vignette {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%);
}

/* 顶部导航 */
.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  padding: 0 40rpx;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.logo-icon {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 900;
  color: #1a1a1a;
}

.logo-text {
  font-size: 32rpx;
  font-weight: 900;
  letter-spacing: 4rpx;
}

/* 导航标签 */
.nav-tabs {
  display: flex;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.05);
  padding: 6rpx;
  border-radius: 10rpx;
}

.nav-tab {
  padding: 12rpx 32rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
}

.nav-tab.active {
  background: rgba(255, 215, 0, 0.15);
  color: #FFD700;
}

/* 右侧 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.user-points {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.points-icon {
  font-size: 24rpx;
}

.points-value {
  font-size: 28rpx;
  font-weight: 700;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.avatar-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 24rpx;
  color: #e8e8e8;
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

.workbench-entry {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 16rpx;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8rpx;
}

.entry-icon {
  font-size: 22rpx;
}

.entry-text {
  font-size: 22rpx;
  color: #FFD700;
}

/* 主内容 */
.lobby-content {
  position: relative;
  z-index: 1;
  display: flex;
  height: calc(100vh - 100rpx);
  padding: 32rpx;
  gap: 32rpx;
}

/* 游戏选择 */
.game-selector {
  width: 400rpx;
  display: flex;
  flex-direction: column;
}

.selector-title {
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.game-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  overflow-y: auto;
}

.game-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  transition: all 0.2s ease;
  position: relative;
}

.game-card.active {
  background: rgba(255, 215, 0, 0.08);
  border-color: var(--game-color);
  box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.15);
}

.game-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.icon-text {
  font-size: 32rpx;
}

.game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.game-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.game-desc {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

.game-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #1a1a1a;
  font-weight: 700;
}

/* 创建房间按钮 */
.create-room-btn {
  margin-top: 20rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.btn-icon {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #1a1a1a;
}

/* 房间列表 */
.room-list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.refresh-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8rpx;
}

.refresh-icon {
  font-size: 24rpx;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.room-list {
  flex: 1;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* 房间卡片 */
.room-card {
  padding: 24rpx;
  margin-bottom: 16rpx;
  transition: all 0.2s ease;
}

.room-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.1);
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.room-game-tag {
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  color: #fff;
  font-weight: 600;
}

.room-status {
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 20rpx;
}

.room-status.waiting {
  background: rgba(74, 222, 128, 0.15);
  color: #4ADE80;
}

.room-status.playing {
  background: rgba(255, 107, 107, 0.15);
  color: #FF6B6B;
}

.room-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.room-info {
  flex: 1;
}

.room-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #e8e8e8;
  margin-bottom: 8rpx;
}

.room-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.room-owner {
  text-align: right;
}

.owner-label {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4rpx;
}

.owner-name {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.room-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.room-players {
  display: flex;
  gap: 6rpx;
}

.player-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.6);
}

.join-btn {
  padding: 8rpx 24rpx;
  background: rgba(255, 215, 0, 0.15);
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 6rpx;
  font-size: 22rpx;
  color: #FFD700;
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
  width: 600rpx;
  padding: 40rpx;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.modal-close {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 10rpx;
}

.modal-body {
  margin-bottom: 32rpx;
}

.form-group {
  margin-bottom: 28rpx;
}

.form-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12rpx;
}

.game-type-display {
  padding: 16rpx 20rpx;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8rpx;
}

.game-type-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFD700;
}

.bet-options,
.player-options {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.bet-option,
.player-option {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.bet-option.active,
.player-option.active {
  background: rgba(255, 215, 0, 0.15);
  border-color: #FFD700;
  color: #FFD700;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
}

.modal-footer .btn-ghost,
.modal-footer .btn-primary {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
}
</style>
