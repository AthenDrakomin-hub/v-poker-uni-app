<script>
export default {
  onLaunch: function() {
    console.log('[V-Poker] App Launch')
    // 横屏锁定（APP端）
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('landscape-primary')
    // #endif
  },
  onShow: function() {
    console.log('[V-Poker] App Show')
  },
  onHide: function() {
    console.log('[V-Poker] App Hide')
  }
}
</script>

<style>
/* 全局样式重置 */
page {
  background-color: #0a0a0a;
  color: #e8e8e8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 通用工具类 */
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-col { display: flex; flex-direction: column; }
.text-center { text-align: center; }
.text-gold { color: #FFD700; }
.text-amber { color: #FFBF00; }
.text-muted { color: rgba(255,255,255,0.5); }
.bg-glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); }
.rounded-lg { border-radius: 12rpx; }
.rounded-full { border-radius: 9999rpx; }

/* 毛玻璃卡片 */
.glass-card {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16rpx;
}

/* 金色渐变文字 */
.gold-text {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 按钮基础样式 */
.btn-primary {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #1a1a1a;
  font-weight: 700;
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  border: none;
  transition: all 0.2s ease;
}
.btn-primary:active {
  transform: scale(0.96);
  opacity: 0.9;
}

.btn-ghost {
  background: rgba(255,255,255,0.08);
  color: #e8e8e8;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  transition: all 0.2s ease;
}
.btn-ghost:active {
  background: rgba(255,255,255,0.15);
}

/* 输入框样式 */
.input-field {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  color: #e8e8e8;
  font-size: 28rpx;
}
.input-field:focus {
  border-color: #FFD700;
  background: rgba(255,215,0,0.05);
}
</style>
