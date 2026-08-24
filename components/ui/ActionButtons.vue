<template>
  <view class="action-buttons" :class="buttonLayout">
    <!-- 看牌 -->
    <view
      v-if="showLook && !hasLooked"
      class="action-btn btn-look"
      :disabled="disabled"
      @click="handleAction('look')"
    >
      <text class="btn-icon">👁</text>
      <text class="btn-text">看牌</text>
    </view>

    <!-- 加注 -->
    <view
      v-if="showRaise"
      class="action-btn btn-raise"
      :disabled="disabled"
      @click="handleAction('raise')"
    >
      <text class="btn-icon">⬆</text>
      <text class="btn-text">加注</text>
      <text v-if="raiseAmount" class="btn-amount">{{ raiseAmount }}</text>
    </view>

    <!-- 跟注 -->
    <view
      v-if="showCall"
      class="action-btn btn-call"
      :disabled="disabled"
      @click="handleAction('call')"
    >
      <text class="btn-icon">✓</text>
      <text class="btn-text">跟注</text>
      <text v-if="callAmount" class="btn-amount">{{ callAmount }}</text>
    </view>

    <!-- 闷开（比牌） -->
    <view
      v-if="showCompare"
      class="action-btn btn-compare"
      :disabled="disabled"
      @click="handleAction('compare')"
    >
      <text class="btn-icon">⚔</text>
      <text class="btn-text">{{ hasLooked ? '比牌' : '闷开' }}</text>
      <text v-if="compareAmount" class="btn-amount">{{ compareAmount }}</text>
    </view>

    <!-- 弃牌 -->
    <view
      v-if="showFold"
      class="action-btn btn-fold"
      :disabled="disabled"
      @click="handleAction('fold')"
    >
      <text class="btn-icon">✕</text>
      <text class="btn-text">弃牌</text>
    </view>

    <!-- 过牌 -->
    <view
      v-if="showCheck"
      class="action-btn btn-check"
      :disabled="disabled"
      @click="handleAction('check')"
    >
      <text class="btn-icon">→</text>
      <text class="btn-text">过牌</text>
    </view>

    <!-- 全押 -->
    <view
      v-if="showAllIn"
      class="action-btn btn-allin"
      :disabled="disabled"
      @click="handleAction('allin')"
    >
      <text class="btn-icon">🔥</text>
      <text class="btn-text">ALL IN</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ActionButtons',
  props: {
    // 游戏类型：jinhua/texas/niuniu/sangong/tbnn
    gameType: {
      type: String,
      default: 'jinhua'
    },
    // 是否已经看牌
    hasLooked: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 跟注金额
    callAmount: {
      type: [Number, String],
      default: ''
    },
    // 加注金额
    raiseAmount: {
      type: [Number, String],
      default: ''
    },
    // 比牌金额
    compareAmount: {
      type: [Number, String],
      default: ''
    },
    // 自定义显示哪些按钮
    visibleActions: {
      type: Array,
      default: null
    }
  },
  emits: ['action'],
  computed: {
    buttonLayout() {
      return 'layout-' + this.gameType
    },
    // 炸金花闷牌状态：只有看牌/加注/闷开/弃牌
    showLook() {
      if (this.visibleActions) return this.visibleActions.includes('look')
      return this.gameType === 'jinhua'
    },
    showRaise() {
      if (this.visibleActions) return this.visibleActions.includes('raise')
      return ['jinhua', 'texas'].includes(this.gameType)
    },
    showCall() {
      if (this.visibleActions) return this.visibleActions.includes('call')
      return this.gameType === 'texas'
    },
    showCompare() {
      if (this.visibleActions) return this.visibleActions.includes('compare')
      return this.gameType === 'jinhua'
    },
    showFold() {
      if (this.visibleActions) return this.visibleActions.includes('fold')
      return ['jinhua', 'texas'].includes(this.gameType)
    },
    showCheck() {
      if (this.visibleActions) return this.visibleActions.includes('check')
      return this.gameType === 'texas'
    },
    showAllIn() {
      if (this.visibleActions) return this.visibleActions.includes('allin')
      return ['jinhua', 'texas'].includes(this.gameType)
    }
  },
  methods: {
    handleAction(action) {
      if (this.disabled) return
      this.$emit('action', action)
    }
  }
}
</script>

<style lang="scss" scoped>
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  min-width: 120rpx;
  height: 100rpx;
  padding: 12rpx 20rpx;
  border-radius: 16rpx;
  transition: all 0.2s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn[disabled] {
  opacity: 0.4;
  pointer-events: none;
}

.btn-icon {
  font-size: 28rpx;
}

.btn-text {
  font-size: 24rpx;
  font-weight: 700;
}

.btn-amount {
  font-size: 18rpx;
  opacity: 0.9;
}

/* 看牌 - 蓝色 */
.btn-look {
  background: linear-gradient(145deg, #3b82f6, #2563eb);
  color: #fff;
}

/* 加注 - 金色 */
.btn-raise {
  background: linear-gradient(145deg, #FFD700, #FFA500);
  color: #1a1a1a;
}

/* 跟注 - 绿色 */
.btn-call {
  background: linear-gradient(145deg, #22c55e, #16a34a);
  color: #fff;
}

/* 比牌/闷开 - 紫色 */
.btn-compare {
  background: linear-gradient(145deg, #a855f7, #9333ea);
  color: #fff;
}

/* 弃牌 - 红色 */
.btn-fold {
  background: linear-gradient(145deg, #ef4444, #dc2626);
  color: #fff;
}

/* 过牌 - 灰色 */
.btn-check {
  background: linear-gradient(145deg, #6b7280, #4b5563);
  color: #fff;
}

/* ALL IN - 橙红 */
.btn-allin {
  background: linear-gradient(145deg, #f97316, #ea580c);
  color: #fff;
  animation: allinPulse 1s ease-in-out infinite;
}

@keyframes allinPulse {
  0%, 100% { box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3); }
  50% { box-shadow: 0 0 20rpx rgba(249, 115, 22, 0.6); }
}
</style>
