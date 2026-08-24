/**
 * V-Poker 房间状态管理
 */
import { reactive, ref } from 'vue'

// 房间状态
export const roomState = reactive({
  // 当前房间
  roomId: null,
  roomInfo: null,
  gameType: '', // niuniu / sangong / tbnn / jinhua / texas

  // 牌局状态
  hand: null,
  handPhase: '', // waiting / dealing / betting / showdown / settled

  // 座位信息
  seats: [], // 座位数组
  mySeatIndex: -1,

  // 底池
  pot: 0,

  // 聊天消息
  messages: [],

  // 连接状态
  isConnected: false,
  isJoining: false,
  error: null,

  // 游戏配置
  config: {
    baseBet: 10,
    maxPlayers: 6,
    gameType: '',
  },
})

// 当前操作玩家
export const currentPlayer = ref(null)

// 我的手牌
export const myHand = ref([])

// 公共牌
export const communityCards = ref([])

/**
 * 设置当前房间
 */
export function setCurrentRoom(roomId, roomInfo) {
  roomState.roomId = roomId
  roomState.roomInfo = roomInfo
  roomState.gameType = roomInfo?.gameType || ''
  roomState.config = {
    ...roomState.config,
    ...roomInfo?.config,
    gameType: roomInfo?.gameType || '',
  }
}

/**
 * 更新牌局状态
 */
export function updateHand(handData) {
  roomState.hand = handData
  roomState.handPhase = handData?.phase || ''
  roomState.pot = handData?.pot || 0

  // 更新座位
  if (handData?.seats) {
    roomState.seats = handData.seats
  }

  // 更新公共牌
  if (handData?.communityCards) {
    communityCards.value = handData.communityCards
  }

  // 更新我的手牌
  if (handData?.myCards) {
    myHand.value = handData.myCards
  }

  // 更新当前操作玩家
  if (handData?.currentPlayer) {
    currentPlayer.value = handData.currentPlayer
  }
}

/**
 * 更新房间信息
 */
export function updateRoomInfo(roomInfo) {
  roomState.roomInfo = roomInfo
  if (roomInfo?.seats) {
    roomState.seats = roomInfo.seats
  }
}

/**
 * 添加聊天消息
 */
export function addChatMessage(message) {
  roomState.messages.push(message)
  // 限制消息数量
  if (roomState.messages.length > 100) {
    roomState.messages.shift()
  }
}

/**
 * 设置连接状态
 */
export function setConnected(connected) {
  roomState.isConnected = connected
}

/**
 * 重置房间状态
 */
export function resetRoomState() {
  roomState.roomId = null
  roomState.roomInfo = null
  roomState.gameType = ''
  roomState.hand = null
  roomState.handPhase = ''
  roomState.seats = []
  roomState.mySeatIndex = -1
  roomState.pot = 0
  roomState.messages = []
  roomState.isConnected = false
  roomState.isJoining = false
  roomState.error = null
  currentPlayer.value = null
  myHand.value = []
  communityCards.value = []
}

/**
 * 设置错误
 */
export function setRoomError(error) {
  roomState.error = error
}

export default {
  roomState,
  currentPlayer,
  myHand,
  communityCards,
  setCurrentRoom,
  updateHand,
  updateRoomInfo,
  addChatMessage,
  setConnected,
  resetRoomState,
  setRoomError,
}
