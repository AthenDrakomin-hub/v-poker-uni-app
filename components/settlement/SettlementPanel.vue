<template>
  <view v-if="visible" class="settlement-panel" :class="{ 'panel-enter': visible }">
    <!-- 背景遮罩 -->
    <view class="panel-overlay" @click="handleOverlayClick"></view>

    <!-- 面板内容 -->
    <view class="panel-content">
      <!-- 标题 -->
      <view class="panel-header">
        <view class="header-line"></view>
        <text class="header-title gold-text">本局结算</text>
        <view class="header-line"></view>
      </view>

      <!-- 玩家结算结果 -->
      <view class="results-section">
        <view
          v-for="(result, index) in results"
          :key="index"
          class="result-item"
          :class="{ 'result-winner': result.amount > 0, 'result-loser': result.amount < 0 }"
        >
          <view class="result-player">
            <view class="player-avatar" :style="{ background: getAvatarColor(result.name) }">
              <text class="avatar-text">{{ result.name?.charAt(0) || '?' }}</text>
            </view>
            <text class="player-name">{{ result.name }}</text>
            <view v-if="result.isWinner" class="winner-badge">
              <text>👑</text>
            </view>
          </view>
          <view class="result-amount">
            <text class="amount-text" :class="result.amount > 0 ? 'amount-win' : 'amount-lose'">
              {{ result.amount > 0 ? '+' : '' }}{{ result.amount }}
            </text>
            <text class="amount-label">筹码</text>
          </view>
        </view>
      </view>

      <!-- 分割线 -->
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">抽水分配</text>
        <view class="divider-line"></view>
      </view>

      <!-- 倒金字塔鎏金动画 -->
      <view class="pyramid-section">
        <PyramidDistribution
          :total-pot="totalPot"
          :hierarchy="hierarchy"
          :active="pyramidActive"
          :show-equation="true"
        />
      </view>

      <!-- 底部操作 -->
      <view class="panel-footer">
        <button class="btn-continue" @click="handleContinue">
          <text>继续游戏</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import PyramidDistribution from './PyramidDistribution.vue'

export default {
  name: 'SettlementPanel',
  components: {
    PyramidDistribution
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 玩家结算结果
    results: {
      type: Array,
      default: () => []
    },
    // 底池总额
    totalPot: {
      type: Number,
      default: 0
    },
    // 层级信息（用于抽水分配）
    hierarchy: {
      type: Object,
      default: () => ({})
    },
    // 是否点击遮罩关闭
    closeOnOverlay: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      pyramidActive: false,
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 延迟启动金字塔动画
        setTimeout(() => {
          this.pyramidActive = true
        }, 500)
      } else {
        this.pyramidActive = false
      }
    },
  },
  methods: {
    // 继续游戏
    handleContinue() {
      this.$emit('continue')
    },
    // 遮罩点击
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.$emit('close')
      }
    },
    // 获取头像颜色
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
  },
}
</script>

<style lang="scss" scoped>
.settlement-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.panel-content {
  position: relative;
  width: 90%;
  max-width: 700rpx;
  max-height: 90vh;
  background: linear-gradient(180deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 0 60rpx rgba(255, 215, 0, 0.15), 0 20rpx 60rpx rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  animation: panelEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes panelEnter {
  0% { opacity: 0; transform: scale(0.9) translateY(20rpx); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* 标题 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.header-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
}

.header-title {
  font-size: 36rpx;
  font-weight: 700;
  letter-spacing: 8rpx;
  white-space: nowrap;
}

/* 玩家结果 */
.results-section {
  margin-bottom: 24rpx;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  margin-bottom: 8rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12rpx;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.result-winner {
  background: rgba(74, 222, 128, 0.08);
  border-color: rgba(74, 222, 128, 0.3);
}

.result-loser {
  opacity: 0.7;
}

.result-player {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.player-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #fff;
}

.player-name {
  font-size: 26rpx;
  color: #e8e8e8;
  font-weight: 600;
  max-width: 160rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.winner-badge {
  font-size: 24rpx;
  animation: winnerBounce 1s ease-in-out infinite;
}

@keyframes winnerBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4rpx); }
}

.result-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.amount-text {
  font-size: 32rpx;
  font-weight: 700;
  font-family: Georgia, serif;
}

.amount-win {
  color: #4ADE80;
  text-shadow: 0 0 10rpx rgba(74, 222, 128, 0.5);
}

.amount-lose {
  color: #FF6B6B;
}

.amount-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 20rpx 0;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: rgba(255, 255, 255, 0.1);
}

.divider-text {
  font-size: 22rpx;
  color: rgba(255, 215, 0, 0.7);
  letter-spacing: 4rpx;
}

/* 金字塔区域 */
.pyramid-section {
  margin-bottom: 24rpx;
  padding: 16rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16rpx;
}

/* 底部 */
.panel-footer {
  display: flex;
  justify-content: center;
  padding-top: 16rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-continue {
  width: 240rpx;
  height: 72rpx;
  line-height: 72rpx;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #1a1a1a;
  font-size: 28rpx;
  font-weight: 700;
  border-radius: 36rpx;
  border: none;
  box-shadow: 0 4rpx 20rpx rgba(255, 215, 0, 0.4);
  transition: all 0.2s ease;
}

.btn-continue:active {
  transform: scale(0.95);
}

/* 金色文字 */
.gold-text {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
