<template>
  <view
    class="poker-card"
    :class="[cardSize, { 'card-back': !faceUp, 'card-dealt': isDealt, 'card-winner': isWinner, 'card-loser': isLoser }]"
    :style="cardStyle"
  >
    <!-- 牌面 -->
    <view v-if="faceUp" class="card-face">
      <!-- 左上角 -->
      <view class="card-corner card-corner-tl">
        <text class="card-rank" :class="suitColor">{{ rank }}</text>
        <text class="card-suit" :class="suitColor">{{ suitSymbol }}</text>
      </view>
      <!-- 中央花色 -->
      <view class="card-center">
        <text class="card-center-suit" :class="suitColor">{{ suitSymbol }}</text>
      </view>
      <!-- 右下角（倒置） -->
      <view class="card-corner card-corner-br">
        <text class="card-rank" :class="suitColor">{{ rank }}</text>
        <text class="card-suit" :class="suitColor">{{ suitSymbol }}</text>
      </view>
    </view>
    <!-- 牌背 -->
    <view v-else class="card-back-face">
      <view class="card-back-pattern">
        <view class="back-pattern-inner"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PokerCard',
  props: {
    // 牌面：如 'As', 'Kd', 'Qh', 'Jc', '10s'
    card: {
      type: String,
      default: ''
    },
    // 是否正面朝上
    faceUp: {
      type: Boolean,
      default: true
    },
    // 牌宽度（rpx），不传则用size预设
    width: {
      type: [Number, String],
      default: ''
    },
    // 预设尺寸：xs/sm/md/lg/xl
    size: {
      type: String,
      default: 'md'
    },
    // 是否已发牌（触发发牌动画）
    isDealt: {
      type: Boolean,
      default: false
    },
    // 是否是赢家牌（高光效果）
    isWinner: {
      type: Boolean,
      default: false
    },
    // 是否是输家牌（灰度效果）
    isLoser: {
      type: Boolean,
      default: false
    },
    // 发牌延迟（ms）
    dealDelay: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 解析牌面
    rank() {
      if (!this.card) return '?'
      const r = this.card.replace(/[hdcs]/i, '')
      return r
    },
    suit() {
      if (!this.card) return ''
      const s = this.card.match(/[hdcs]/i)
      return s ? s[0].toLowerCase() : ''
    },
    suitSymbol() {
      const map = { h: '♥', d: '♦', c: '♣', s: '♠' }
      return map[this.suit] || '?'
    },
    suitColor() {
      return (this.suit === 'h' || this.suit === 'd') ? 'suit-red' : 'suit-black'
    },
    cardSize() {
      return 'size-' + this.size
    },
    cardStyle() {
      const style = {}
      if (this.width) {
        style.width = this.width + 'rpx'
        // 扑克牌比例 3:4
        const w = parseInt(this.width)
        style.height = (w * 4 / 3) + 'rpx'
      }
      if (this.dealDelay) {
        style.animationDelay = this.dealDelay + 'ms'
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.poker-card {
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
}

/* 尺寸预设 */
.size-xs { width: 60rpx; height: 80rpx; }
.size-sm { width: 80rpx; height: 106rpx; }
.size-md { width: 100rpx; height: 133rpx; }
.size-lg { width: 120rpx; height: 160rpx; }
.size-xl { width: 140rpx; height: 186rpx; }

/* 牌面 */
.card-face {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
  position: relative;
}

/* 角落 */
.card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.card-corner-tl {
  top: 6rpx;
  left: 6rpx;
}

.card-corner-br {
  bottom: 6rpx;
  right: 6rpx;
  transform: rotate(180deg);
}

.card-rank {
  font-size: 20rpx;
  font-weight: 700;
  font-family: Georgia, serif;
}

.card-suit {
  font-size: 18rpx;
  margin-top: 2rpx;
}

/* 中央花色 */
.card-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card-center-suit {
  font-size: 40rpx;
}

/* 颜色 */
.suit-red {
  color: #DC2626;
}

.suit-black {
  color: #1a1a1a;
}

/* 牌背 */
.card-back-face {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-pattern {
  width: 80%;
  height: 80%;
  border: 2rpx solid rgba(255, 215, 0, 0.3);
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-pattern-inner {
  width: 70%;
  height: 70%;
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 215, 0, 0.1),
    rgba(255, 215, 0, 0.1) 4rpx,
    transparent 4rpx,
    transparent 8rpx
  );
  border-radius: 2rpx;
}

/* 发牌动画 */
.card-dealt {
  animation: dealCard 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes dealCard {
  0% {
    transform: translateY(-200rpx) scale(0.8) rotate(-10deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 赢家高光 */
.card-winner {
  box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.8), 0 0 40rpx rgba(255, 215, 0, 0.4);
  transform: scale(1.08);
  z-index: 10;
}

/* 输家灰度 */
.card-loser {
  filter: grayscale(0.6);
  opacity: 0.7;
}
</style>
