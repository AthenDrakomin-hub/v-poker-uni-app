<template>
  <view class="chip-stack" :class="chipSize" :style="stackStyle">
    <view
      v-for="(chip, index) in visibleChips"
      :key="index"
      class="chip"
      :class="chip.color"
      :style="getChipStyle(index)"
    >
      <view class="chip-inner">
        <text class="chip-value">{{ chip.value }}</text>
      </view>
    </view>
    <!-- 金额标签 -->
    <view v-if="showLabel" class="chip-label">
      <text class="label-text">{{ formatPoints(totalValue) }}</text>
    </view>
  </view>
</template>

<script>
import { formatPoints } from '../../utils/format.js'

export default {
  name: 'ChipStack',
  props: {
    // 总金额
    value: {
      type: Number,
      default: 0
    },
    // 筹码堆最大层数
    maxStack: {
      type: Number,
      default: 5
    },
    // 尺寸：sm/md/lg
    size: {
      type: String,
      default: 'md'
    },
    // 是否显示金额标签
    showLabel: {
      type: Boolean,
      default: false
    },
    // 是否播放入场动画
    animate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    chipSize() {
      return 'size-' + this.size
    },
    // 根据总金额计算筹码组合
    chipComposition() {
      let remaining = this.value
      const chips = []
      const denominations = [
        { value: 1000, color: 'chip-black' },
        { value: 500, color: 'chip-purple' },
        { value: 100, color: 'chip-green' },
        { value: 50, color: 'chip-blue' },
        { value: 25, color: 'chip-red' },
        { value: 10, color: 'chip-yellow' },
        { value: 5, color: 'chip-white' },
        { value: 1, color: 'chip-gray' }
      ]

      for (const denom of denominations) {
        while (remaining >= denom.value && chips.length < this.maxStack * 2) {
          chips.push({ ...denom })
          remaining -= denom.value
        }
      }

      // 如果还有剩余且没满，用最小筹码
      while (remaining > 0 && chips.length < this.maxStack * 2) {
        chips.push({ value: 1, color: 'chip-gray' })
        remaining -= 1
      }

      return chips
    },
    // 可见筹码（分层显示）
    visibleChips() {
      // 最多显示maxStack层，每层代表多个筹码
      const total = this.chipComposition.length
      if (total <= this.maxStack) {
        return this.chipComposition
      }
      // 压缩显示
      const perLayer = Math.ceil(total / this.maxStack)
      const result = []
      for (let i = 0; i < this.maxStack; i++) {
        const start = i * perLayer
        if (start < total) {
          result.push(this.chipComposition[start])
        }
      }
      return result
    },
    totalValue() {
      return this.value
    },
    stackStyle() {
      const style = {}
      if (this.animate) {
        style.animation = 'stackIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both'
      }
      return style
    }
  },
  methods: {
    formatPoints,
    getChipStyle(index) {
      return {
        bottom: index * 6 + 'rpx',
        zIndex: index,
        animationDelay: this.animate ? (index * 50) + 'ms' : '0ms'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chip-stack {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.size-sm { width: 50rpx; height: 50rpx; }
.size-md { width: 70rpx; height: 70rpx; }
.size-lg { width: 90rpx; height: 90rpx; }

.chip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4), inset 0 1rpx 2rpx rgba(255, 255, 255, 0.3);
}

.size-sm .chip { width: 40rpx; height: 40rpx; }
.size-md .chip { width: 56rpx; height: 56rpx; }
.size-lg .chip { width: 72rpx; height: 72rpx; }

.chip-inner {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  border: 2rpx dashed rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-sm .chip-value { font-size: 14rpx; }
.size-md .chip-value { font-size: 18rpx; }
.size-lg .chip-value { font-size: 22rpx; }

.chip-value {
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5);
}

/* 筹码颜色 */
.chip-black { background: linear-gradient(145deg, #2d2d2d, #1a1a1a); border: 2rpx solid #444; }
.chip-purple { background: linear-gradient(145deg, #9333ea, #7e22ce); border: 2rpx solid #a855f7; }
.chip-green { background: linear-gradient(145deg, #16a34a, #15803d); border: 2rpx solid #22c55e; }
.chip-blue { background: linear-gradient(145deg, #2563eb, #1d4ed8); border: 2rpx solid #3b82f6; }
.chip-red { background: linear-gradient(145deg, #dc2626, #b91c1c); border: 2rpx solid #ef4444; }
.chip-yellow { background: linear-gradient(145deg, #eab308, #ca8a04); border: 2rpx solid #facc15; }
.chip-white { background: linear-gradient(145deg, #f8fafc, #e2e8f0); border: 2rpx solid #fff; }
.chip-white .chip-value { color: #333; text-shadow: none; }
.chip-gray { background: linear-gradient(145deg, #6b7280, #4b5563); border: 2rpx solid #9ca3af; }

/* 金额标签 */
.chip-label {
  position: absolute;
  bottom: -28rpx;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.label-text {
  font-size: 20rpx;
  font-weight: 600;
  color: #FFD700;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.8);
}

/* 入场动画 */
@keyframes stackIn {
  0% {
    transform: scale(0) translateY(-50rpx);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.chip {
  animation: chipIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes chipIn {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}
</style>
