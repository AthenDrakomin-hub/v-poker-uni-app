<template>
  <view class="room-page" :class="themeClass">
    <!-- 主题背景层（含粒子效果） -->
    <ThemeBackground
      :game-type="roomInfo?.gameType || 'niuniu'"
      :show-particles="true"
      :particles-enabled="soundEnabled"
    />

    <!-- 子弹时间遮罩 -->
    <view v-if="bulletTimeActive" class="bullet-time-overlay"></view>

    <!-- 开牌高潮动画 -->
    <OpenCardEffect
      :active="openCardActive"
      :effect-type="currentOpenCardEffect"
      :color="currentThemeColor"
      :duration="600"
      :screen-shake="true"
      :shake-intensity="5"
      @complete="openCardActive = false"
    />

    <!-- 顶部HUD -->
    <view class="room-hud">
      <view class="hud-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="room-info">
          <text class="room-name">{{ roomInfo?.name || '房间#' + roomId }}</text>
          <text class="room-game">{{ formatGameType(roomInfo?.gameType) }}</text>
        </view>
      </view>
      <view class="hud-center">
        <!-- 倒计时 -->
        <view v-if="countdown > 0" class="countdown">
          <text class="countdown-num">{{ countdown }}</text>
        </view>
      </view>
      <view class="hud-right">
        <view class="user-points-hud">
          <text class="points-icon">💰</text>
          <text class="points-value">{{ formatPoints(userState.points) }}</text>
        </view>
        <view class="settings-btn" @click="showSettings = true">
          <text>⚙</text>
        </view>
      </view>
    </view>

    <!-- 牌桌区域 -->
    <view class="poker-table">
      <!-- 牌桌椭圆 -->
      <view class="table-ellipse">
        <view class="table-inner"></view>
        <view class="table-border"></view>
      </view>

      <!-- 底池（黄金三角区） -->
      <view class="pot-area">
        <PotDisplay :value="currentPot" size="md" />
      </view>

      <!-- 公共牌区域 -->
      <view v-if="communityCards.length > 0" class="community-cards">
        <PokerCard
          v-for="(card, index) in communityCards"
          :key="index"
          :card="card"
          face-up
          size="md"
          :is-dealt="cardsDealt"
          :deal-delay="index * 100"
          :class="{ 'card-winner-highlight': isWinningCard(index) }"
        />
      </view>

      <!-- 座位区域（6人桌） -->
      <view class="seats-container">
        <!-- 顶部左 -->
        <PlayerSeat
          :player="seats[0]?.player"
          position="top-left"
          :is-active="seats[0]?.isActive"
          :is-me="seats[0]?.isMe"
          :player-cards="seats[0]?.cards || []"
          :cards-dealt="cardsDealt"
          :is-folded="seats[0]?.isFolded"
          :is-winner="seats[0]?.isWinner"
          :is-dealer="seats[0]?.isDealer"
          :custom-style="{ top: '8%', left: '15%' }"
        />
        <!-- 顶部中 -->
        <PlayerSeat
          :player="seats[1]?.player"
          position="top"
          :is-active="seats[1]?.isActive"
          :is-me="seats[1]?.isMe"
          :player-cards="seats[1]?.cards || []"
          :cards-dealt="cardsDealt"
          :is-folded="seats[1]?.isFolded"
          :is-winner="seats[1]?.isWinner"
          :is-dealer="seats[1]?.isDealer"
          :custom-style="{ top: '2%', left: '50%', transform: 'translateX(-50%)' }"
        />
        <!-- 顶部右 -->
        <PlayerSeat
          :player="seats[2]?.player"
          position="top-right"
          :is-active="seats[2]?.isActive"
          :is-me="seats[2]?.isMe"
          :player-cards="seats[2]?.cards || []"
          :cards-dealt="cardsDealt"
          :is-folded="seats[2]?.isFolded"
          :is-winner="seats[2]?.isWinner"
          :is-dealer="seats[2]?.isDealer"
          :custom-style="{ top: '8%', right: '15%' }"
        />
        <!-- 底部左 -->
        <PlayerSeat
          :player="seats[3]?.player"
          position="bottom-left"
          :is-active="seats[3]?.isActive"
          :is-me="seats[3]?.isMe"
          :player-cards="seats[3]?.cards || []"
          :cards-dealt="cardsDealt"
          :is-folded="seats[3]?.isFolded"
          :is-winner="seats[3]?.isWinner"
          :is-dealer="seats[3]?.isDealer"
          :custom-style="{ bottom: '22%', left: '15%' }"
        />
        <!-- 底部中（我） -->
        <PlayerSeat
          :player="mySeat?.player"
          position="bottom"
          :is-active="mySeat?.isActive"
          :is-me="true"
          :player-cards="myCards"
          :cards-dealt="cardsDealt"
          :is-folded="mySeat?.isFolded"
          :is-winner="mySeat?.isWinner"
          :is-dealer="mySeat?.isDealer"
          :custom-style="{ bottom: '20%', left: '50%', transform: 'translateX(-50%)' }"
        />
        <!-- 底部右 -->
        <PlayerSeat
          :player="seats[5]?.player"
          position="bottom-right"
          :is-active="seats[5]?.isActive"
          :is-me="seats[5]?.isMe"
          :player-cards="seats[5]?.cards || []"
          :cards-dealt="cardsDealt"
          :is-folded="seats[5]?.isFolded"
          :is-winner="seats[5]?.isWinner"
          :is-dealer="seats[5]?.isDealer"
          :custom-style="{ bottom: '22%', right: '15%' }"
        />
      </view>
    </view>

    <!-- 我的手牌（前置区，最高Z轴） -->
    <view v-if="myCards.length > 0" class="my-hand-area">
      <PokerCard
        v-for="(card, index) in myCards"
        :key="index"
        :card="card"
        :face-up="hasLooked || showAllCards"
        size="lg"
        :is-dealt="cardsDealt"
        :deal-delay="index * 80"
        :is-winner="mySeat?.isWinner"
        :style="{
          marginLeft: index > 0 ? '-40rpx' : '0',
          zIndex: index,
          transform: 'rotate(' + (index - (myCards.length - 1) / 2) * 3 + 'deg)'
        }"
      />
    </view>

    <!-- 操作栏 -->
    <view v-if="isMyTurn && !showAllCards" class="action-bar">
      <ActionButtons
        :game-type="roomInfo?.gameType"
        :has-looked="hasLooked"
        :disabled="isActing"
        :call-amount="callAmount"
        :raise-amount="raiseAmount"
        :compare-amount="compareAmount"
        @action="handleAction"
      />
    </view>

    <!-- 聊天框（半透明悬浮，不遮挡牌面） -->
    <ChatBox
      :messages="chatMessages"
      @send="sendChat"
    />

    <!-- V3结算面板（含倒金字塔鎏金动画） -->
    <SettlementPanel
      :visible="showSettlement"
      :results="settlementResults"
      :total-pot="currentPot"
      :hierarchy="hierarchy"
      @continue="closeSettlement"
    />

    <!-- 设置弹窗 -->
    <view v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <view class="modal-content glass-card" @click.stop>
        <view class="modal-header">
          <text class="modal-title">设置</text>
          <text class="modal-close" @click="showSettings = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="setting-item">
            <text class="setting-label">音效</text>
            <switch :checked="soundEnabled" @change="soundEnabled = !soundEnabled" color="#FFD700" />
          </view>
          <view class="setting-item">
            <text class="setting-label">震动反馈</text>
            <switch :checked="vibrateEnabled" @change="vibrateEnabled = !vibrateEnabled" color="#FFD700" />
          </view>
          <view class="setting-item">
            <text class="setting-label">自动看牌</text>
            <switch :checked="autoLook" @change="autoLook = !autoLook" color="#FFD700" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import PokerCard from '../../components/poker/PokerCard.vue'
import ChipStack from '../../components/chips/ChipStack.vue'
import PotDisplay from '../../components/chips/PotDisplay.vue'
import PlayerSeat from '../../components/seat/PlayerSeat.vue'
import ActionButtons from '../../components/ui/ActionButtons.vue'
import ChatBox from '../../components/ui/ChatBox.vue'
import ThemeBackground from '../../components/ui/ThemeBackground.vue'
import OpenCardEffect from '../../components/ui/OpenCardEffect.vue'
import SettlementPanel from '../../components/settlement/SettlementPanel.vue'
import { userState, fetchUserInfo } from '../../store/user.js'
import { formatPoints, formatGameType } from '../../utils/format.js'
import { getRoom, getRoomHand, performAction, sendRoomChat } from '../../api/rooms.js'
import { getThemeByGameType } from '../../themes/themeConfig.js'
import { getSoundManager } from '../../utils/sound.js'

export default {
  name: 'RoomPage',
  components: {
    PokerCard,
    ChipStack,
    PotDisplay,
    PlayerSeat,
    ActionButtons,
    ChatBox,
    ThemeBackground,
    OpenCardEffect,
    SettlementPanel
  },
  data() {
    return {
      userState,
      roomId: null,
      roomInfo: null,
      handData: null,
      // 座位数据（6人桌）
      seats: [
        { player: null, isActive: false, isMe: false, cards: [], isFolded: false, isWinner: false, isDealer: false },
        { player: null, isActive: false, isMe: false, cards: [], isFolded: false, isWinner: false, isDealer: false },
        { player: null, isActive: false, isMe: false, cards: [], isFolded: false, isWinner: false, isDealer: false },
        { player: null, isActive: false, isMe: false, cards: [], isFolded: false, isWinner: false, isDealer: false },
        { player: null, isActive: false, isMe: true, cards: [], isFolded: false, isWinner: false, isDealer: false },
        { player: null, isActive: false, isMe: false, cards: [], isFolded: false, isWinner: false, isDealer: false }
      ],
      mySeatIndex: 4,
      // 牌局状态
      currentPot: 0,
      communityCards: [],
      myCards: [],
      hasLooked: false,
      showAllCards: false,
      cardsDealt: false,
      isMyTurn: false,
      isActing: false,
      countdown: 0,
      // 操作金额
      callAmount: '',
      raiseAmount: '',
      compareAmount: '',
      // 聊天
      chatMessages: [],
      // 结算
      showSettlement: false,
      settlementResults: [],
      bulletTimeActive: false,
      // 开牌动画
      openCardActive: false,
      // 音效管理器
      soundManager: null,
      // V3经济模型 - 层级信息（用于抽水分配）
      hierarchy: {
        L0: null, // 开房代理
        L1: null, // 一级代理
        L2: null, // 总代理
      },
      // 设置
      showSettings: false,
      soundEnabled: true,
      vibrateEnabled: true,
      autoLook: false,
      // 定时器
      countdownTimer: null
    }
  },
  computed: {
    mySeat() {
      return this.seats[this.mySeatIndex]
    },
    themeClass() {
      const themeMap = {
        niuniu: 'theme-forbidden-city',
        sangong: 'theme-jiangnan',
        tbnn: 'theme-steampunk',
        jinhua: 'theme-noir',
        texas: 'theme-wallstreet'
      }
      return themeMap[this.roomInfo?.gameType] || 'theme-default'
    },
    // 当前主题配置
    currentTheme() {
      return getThemeByGameType(this.roomInfo?.gameType || 'niuniu')
    },
    // 当前开牌动画类型
    currentOpenCardEffect() {
      return this.currentTheme?.openCardEffect?.type || 'gold_burst'
    },
    // 当前主题颜色
    currentThemeColor() {
      return this.currentTheme?.colors?.primary || '#FFD700'
    },
    winningCardIndices() {
      // 简化：假设赢家的牌索引
      return []
    }
  },
  onLoad(options) {
    this.roomId = options.id
    this.initRoom()
  },
  onUnload() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
    // 销毁音效管理器
    if (this.soundManager) {
      this.soundManager.destroy()
    }
  },
  methods: {
    formatPoints,
    formatGameType,

    // 初始化房间
    async initRoom() {
      try {
        // 初始化音效管理器
        this.soundManager = getSoundManager()
        this.soundManager.init(this.roomInfo?.gameType || 'niuniu')

        // 获取房间信息
        this.roomInfo = await getRoom(this.roomId)
        // 设置主题音效
        this.soundManager.setTheme(this.roomInfo?.gameType || 'niuniu')
        // 加载层级信息（V3抽水分配）
        this.loadHierarchy()
        // 获取牌局状态
        await this.loadHand()
        // 刷新用户信息
        fetchUserInfo()
        // 模拟发牌动画
        setTimeout(() => {
          this.cardsDealt = true
          // 播放发牌音效
          this.soundManager.playDeal()
        }, 500)
      } catch (e) {
        console.error('[Room] 初始化失败', e)
        uni.showToast({ title: '加载房间失败', icon: 'none' })
      }
    },

    // 加载牌局状态
    async loadHand() {
      try {
        this.handData = await getRoomHand(this.roomId)
        this.updateHandState(this.handData)
      } catch (e) {
        console.error('[Room] 加载牌局失败', e)
      }
    },

    // 更新牌局状态
    updateHandState(data) {
      if (!data) return
      this.currentPot = data.pot || 0
      this.communityCards = data.communityCards || []
      this.myCards = data.myCards || data.hand || []
      this.hasLooked = data.hasLooked || false
      this.showAllCards = data.phase === 'showdown' || data.phase === 'settled'
      this.isMyTurn = data.currentPlayerId === userState.id
      this.countdown = data.countdown || 0

      // 更新座位
      if (data.seats) {
        data.seats.forEach((seat, index) => {
          if (this.seats[index]) {
            this.seats[index].player = seat.player || null
            this.seats[index].isActive = seat.isActive || false
            this.seats[index].cards = seat.cards || []
            this.seats[index].isFolded = seat.isFolded || false
            this.seats[index].isWinner = seat.isWinner || false
            this.seats[index].isDealer = seat.isDealer || false
          }
        })
      }

      // 结算状态
      if (data.phase === 'settled' && data.results) {
        this.showSettlement = true
        this.settlementResults = data.results
        // 触发开牌高潮动画
        this.triggerOpenCardEffect()
        // 触发子弹时间
        this.triggerBulletTime()
        // 播放赢牌音效
        if (this.soundManager) {
          this.soundManager.playWin()
        }
      }

      // 启动倒计时
      if (this.countdown > 0) {
        this.startCountdown()
      }
    },

    // 启动倒计时
    startCountdown() {
      if (this.countdownTimer) clearInterval(this.countdownTimer)
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          clearInterval(this.countdownTimer)
        }
      }, 1000)
    },

    // 处理操作
    async handleAction(action) {
      if (this.isActing) return
      this.isActing = true

      try {
        const actionData = {}
        if (action === 'raise') actionData.amount = this.raiseAmount || 20
        if (action === 'compare') actionData.targetId = null

        // 播放操作音效
        if (this.soundManager) {
          if (action === 'look') {
            this.soundManager.playLookCard()
          } else if (action === 'fold') {
            this.soundManager.playFold()
          } else {
            this.soundManager.playChip()
          }
        }

        await performAction(this.roomId, action, actionData)

        // 操作成功后刷新状态
        setTimeout(() => this.loadHand(), 300)
      } catch (e) {
        console.error('[Room] 操作失败', e)
      } finally {
        this.isActing = false
      }
    },

    // 发送聊天
    async sendChat(message) {
      try {
        await sendRoomChat(this.roomId, message)
        this.chatMessages.push({
          senderName: userState.nickname || '我',
          content: message,
          isSelf: true,
          type: 'chat'
        })
      } catch (e) {
        console.error('[Room] 发送聊天失败', e)
      }
    },

    // 触发子弹时间
    triggerBulletTime() {
      this.bulletTimeActive = true
      setTimeout(() => {
        this.bulletTimeActive = false
      }, 1200)
    },

    // 触发开牌高潮动画
    triggerOpenCardEffect() {
      this.openCardActive = true
      // 播放开牌音效
      if (this.soundManager) {
        this.soundManager.playOpenCard()
      }
    },

    // 加载层级信息（V3抽水分配）
    loadHierarchy() {
      // 从房间信息中获取层级信息
      // 实际项目中应从后端API获取
      if (this.roomInfo?.hierarchy) {
        this.hierarchy = { ...this.roomInfo.hierarchy }
      } else {
        // 模拟层级信息（实际项目中从后端获取）
        // L0: 开房代理（当前房间创建者）
        // L1: 一级代理（开房代理的上级）
        // L2: 总代理（一级代理的上级）
        this.hierarchy = {
          L0: this.roomInfo?.creatorId || null,
          L1: null, // 模拟：无一级代理
          L2: null, // 模拟：无总代理
        }
      }
    },

    // 关闭结算
    closeSettlement() {
      this.showSettlement = false
      this.loadHand()
    },

    // 判断是否是赢牌
    isWinningCard(index) {
      return this.winningCardIndices.includes(index)
    },

    // 返回
    goBack() {
      uni.showModal({
        title: '确认离开',
        content: '确定要离开房间吗？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.room-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* 背景 */
.room-bg {
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
  background: radial-gradient(ellipse at center, #1a2a1a 0%, #0a1a0a 50%, #050a05 100%);
}

.bg-vignette {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.7) 100%);
}

/* 子弹时间遮罩 */
.bullet-time-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.9) 80%);
  animation: bulletTime 1.2s ease both;
  z-index: 5;
  pointer-events: none;
}

@keyframes bulletTime {
  0% { opacity: 0; }
  25% { opacity: 1; }
  75% { opacity: 1; }
  100% { opacity: 0; }
}

/* 顶部HUD */
.room-hud {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.hud-left, .hud-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.back-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.back-icon {
  font-size: 28rpx;
  color: #e8e8e8;
}

.room-info {
  display: flex;
  flex-direction: column;
}

.room-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.room-game {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* 倒计时 */
.countdown {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 215, 0, 0.2);
  border: 2rpx solid #FFD700;
  border-radius: 50%;
}

.countdown-num {
  font-size: 28rpx;
  font-weight: 700;
  color: #FFD700;
}

.user-points-hud {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: rgba(0, 0, 0, 0.5);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.points-icon { font-size: 20rpx; }
.points-value { font-size: 24rpx; font-weight: 600; color: #FFD700; }

.settings-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 24rpx;
}

/* 牌桌区域 */
.poker-table {
  position: relative;
  z-index: 1;
  width: 100%;
  height: calc(100vh - 80rpx);
}

.table-ellipse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 65%;
}

.table-inner {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, #1a4a2a 0%, #0d2d18 70%, #081f10 100%);
  border-radius: 50%;
  box-shadow: inset 0 0 100rpx rgba(0, 0, 0, 0.5), 0 20rpx 60rpx rgba(0, 0, 0, 0.6);
}

.table-border {
  position: absolute;
  top: -12rpx;
  left: -12rpx;
  right: -12rpx;
  bottom: -12rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513, #654321, #8B4513);
  z-index: -1;
}

/* 底池区域（黄金三角区） */
.pot-area {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* 公共牌 */
.community-cards {
  position: absolute;
  top: 52%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12rpx;
  z-index: 10;
}

.card-winner-highlight {
  box-shadow: 0 0 24rpx rgba(255, 215, 0, 0.8);
}

/* 座位容器 */
.seats-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
}

/* 我的手牌（前置区，最高Z轴） */
.my-hand-area {
  position: absolute;
  bottom: 140rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

/* 操作栏 */
.action-bar {
  position: absolute;
  bottom: 24rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: 90%;
  display: flex;
  justify-content: center;
}

/* 结算面板 */
.settlement-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.settlement-content {
  width: 500rpx;
  padding: 40rpx;
}

.settlement-title {
  text-align: center;
  margin-bottom: 32rpx;
}

.title-text {
  font-size: 40rpx;
  font-weight: 700;
}

.settlement-results {
  margin-bottom: 32rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-name {
  font-size: 28rpx;
  color: #e8e8e8;
}

.result-amount {
  font-size: 32rpx;
  font-weight: 700;
}

.amount-win { color: #4ADE80; }
.amount-lose { color: #FF6B6B; }

.settlement-actions {
  display: flex;
  justify-content: center;
}

.settlement-actions .btn-primary {
  width: 200rpx;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
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
  z-index: 300;
}

.modal-content {
  width: 480rpx;
  padding: 32rpx;
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
  color: #e8e8e8;
}

.modal-close {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 10rpx;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.setting-label {
  font-size: 28rpx;
  color: #e8e8e8;
}
</style>
