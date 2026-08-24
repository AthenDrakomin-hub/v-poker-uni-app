<template>
  <view
    class="player-seat"
    :class="[seatPosition, { 'seat-active': isActive, 'seat-folded': isFolded, 'seat-empty': !player }]"
    :style="seatStyle"
  >
    <!-- 呼吸光晕（行动期） -->
    <view v-if="isActive" class="breathing-halo"></view>

    <!-- 座位主体 -->
    <view class="seat-body">
      <!-- 头像 -->
      <view class="seat-avatar" :class="{ 'avatar-active': isActive }">
        <view v-if="player" class="avatar-circle">
          <text class="avatar-text">{{ player.nickname?.charAt(0) || '?' }}</text>
        </view>
        <view v-else class="avatar-empty">
          <text class="empty-icon">+</text>
        </view>
        <!-- 在线状态点 -->
        <view v-if="player" class="status-dot" :class="player.isOnline ? 'online' : 'offline'"></view>
      </view>

      <!-- 玩家信息 -->
      <view v-if="player" class="seat-info">
        <text class="player-name">{{ player.nickname || player.account }}</text>
        <view class="player-points">
          <text class="points-icon">💰</text>
          <text class="points-value">{{ formatPoints(player.points || 0) }}</text>
        </view>
      </view>

      <!-- 手牌区域 -->
      <view v-if="player && showCards" class="seat-cards">
        <PokerCard
          v-for="(card, index) in playerCards"
          :key="index"
          :card="card"
          :face-up="isMe || showAllCards"
          size="sm"
          :is-dealt="cardsDealt"
          :deal-delay="index * 80"
          :style="{ marginLeft: index > 0 ? '-20rpx' : '0', zIndex: index }"
        />
      </view>

      <!-- 下注筹码 -->
      <view v-if="player && player.bet > 0" class="seat-bet">
        <ChipStack :value="player.bet" size="sm" :animate="true" />
      </view>

      <!-- 状态标签 -->
      <view v-if="player" class="seat-status">
        <view v-if="isActive" class="status-tag status-thinking">
          <text>思考中</text>
        </view>
        <view v-else-if="isFolded" class="status-tag status-folded">
          <text>弃牌</text>
        </view>
        <view v-else-if="isAllIn" class="status-tag status-allin">
          <text>ALL IN</text>
        </view>
        <view v-else-if="isWinner" class="status-tag status-winner">
          <text>赢家</text>
        </view>
      </view>

      <!-- 庄家标识 -->
      <view v-if="isDealer" class="dealer-button">
        <text>D</text>
      </view>
    </view>
  </view>
</template>

<script>
import PokerCard from '../poker/PokerCard.vue'
import ChipStack from '../chips/ChipStack.vue'
import { formatPoints } from '../../utils/format.js'

export default {
  name: 'PlayerSeat',
  components: {
    PokerCard,
    ChipStack
  },
  props: {
    // 玩家数据
    player: {
      type: Object,
      default: null
    },
    // 座位位置：top-left/top/top-right/bottom-left/bottom/bottom-right/left/right
    position: {
      type: String,
      default: 'bottom'
    },
    // 是否是当前行动玩家
    isActive: {
      type: Boolean,
      default: false
    },
    // 是否是我自己
    isMe: {
      type: Boolean,
      default: false
    },
    // 是否显示手牌
    showCards: {
      type: Boolean,
      default: true
    },
    // 是否显示所有牌（摊牌时）
    showAllCards: {
      type: Boolean,
      default: false
    },
    // 玩家手牌
    playerCards: {
      type: Array,
      default: () => []
    },
    // 牌是否已发
    cardsDealt: {
      type: Boolean,
      default: false
    },
    // 是否弃牌
    isFolded: {
      type: Boolean,
      default: false
    },
    // 是否ALL IN
    isAllIn: {
      type: Boolean,
      default: false
    },
    // 是否是赢家
    isWinner: {
      type: Boolean,
      default: false
    },
    // 是否是庄家
    isDealer: {
      type: Boolean,
      default: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    seatPosition() {
      return 'pos-' + this.position
    },
    seatStyle() {
      return { ...this.customStyle }
    }
  },
  methods: {
    formatPoints
  }
}
</script>

<style lang="scss" scoped>
.player-seat {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.seat-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

/* 呼吸光晕 */
.breathing-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
  animation: breathing 0.667s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes breathing {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(0.9);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* 头像 */
.seat-avatar {
  position: relative;
  z-index: 1;
}

.avatar-circle {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
}

.avatar-active .avatar-circle {
  border-color: #FFD700;
  box-shadow: 0 0 16rpx rgba(255, 215, 0, 0.6);
}

.avatar-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}

.avatar-empty {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2rpx dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.3);
}

/* 在线状态 */
.status-dot {
  position: absolute;
  bottom: 2rpx;
  right: 2rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  border: 2rpx solid #0a0a0a;
}

.status-dot.online {
  background: #4ADE80;
}

.status-dot.offline {
  background: #6B7280;
}

/* 玩家信息 */
.seat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
}

.player-name {
  font-size: 20rpx;
  color: #e8e8e8;
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.8);
}

.player-points {
  display: flex;
  align-items: center;
  gap: 4rpx;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
}

.points-icon {
  font-size: 16rpx;
}

.points-value {
  font-size: 18rpx;
  font-weight: 600;
  color: #FFD700;
}

/* 手牌区域 */
.seat-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4rpx;
}

/* 下注筹码 */
.seat-bet {
  position: absolute;
  bottom: -30rpx;
  left: 50%;
  transform: translateX(-50%);
}

/* 状态标签 */
.seat-status {
  position: absolute;
  top: -10rpx;
  left: 50%;
  transform: translateX(-50%);
}

.status-tag {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 16rpx;
  font-weight: 600;
  white-space: nowrap;
}

.status-thinking {
  background: rgba(255, 215, 0, 0.9);
  color: #1a1a1a;
  animation: pulse 0.667s ease-in-out infinite;
}

.status-folded {
  background: rgba(107, 114, 128, 0.8);
  color: #e8e8e8;
}

.status-allin {
  background: rgba(220, 38, 38, 0.9);
  color: #fff;
}

.status-winner {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a1a;
  box-shadow: 0 0 12rpx rgba(255, 215, 0, 0.6);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 庄家标识 */
.dealer-button {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.dealer-button text {
  font-size: 16rpx;
  font-weight: 900;
  color: #1a1a1a;
}

/* 弃牌状态 */
.seat-folded {
  opacity: 0.5;
}

.seat-folded .avatar-circle {
  filter: grayscale(0.5);
}

/* 空座位 */
.seat-empty {
  opacity: 0.6;
}
</style>
