/**
 * V-Poker 房间 WebSocket 事件封装
 */
import { getSocket } from './index.js'

/**
 * 房间Socket管理器
 */
class RoomSocketManager {
  constructor() {
    this.currentRoomId = null
    this.roomHandlers = {}
  }

  /**
   * 加入房间
   */
  joinRoom(roomId, callback) {
    const socket = getSocket()

    // 先离开之前的房间
    if (this.currentRoomId && this.currentRoomId !== roomId) {
      this.leaveRoom(this.currentRoomId)
    }

    this.currentRoomId = roomId

    // 发送加入房间事件
    return socket.emitEvent('join_room', { roomId }, (ack) => {
      if (callback) callback(ack)
    })
  }

  /**
   * 离开房间
   */
  leaveRoom(roomId, callback) {
    const socket = getSocket()

    if (this.currentRoomId === roomId) {
      this.currentRoomId = null
    }

    // 清除房间事件监听
    this.clearRoomHandlers()

    return socket.emitEvent('leave_room', { roomId }, (ack) => {
      if (callback) callback(ack)
    })
  }

  /**
   * 监听房间状态更新
   */
  onRoomUpdate(handler) {
    const socket = getSocket()
    socket.on('room_update', handler)
    this.roomHandlers['room_update'] = handler
  }

  /**
   * 监听牌局状态更新
   */
  onHandUpdate(handler) {
    const socket = getSocket()
    socket.on('hand_update', handler)
    this.roomHandlers['hand_update'] = handler
  }

  /**
   * 监听聊天消息
   */
  onChatMessage(handler) {
    const socket = getSocket()
    socket.on('chat_message', handler)
    this.roomHandlers['chat_message'] = handler
  }

  /**
   * 监听状态变更信号
   */
  onStateChanged(handler) {
    const socket = getSocket()
    socket.on('state_changed', handler)
    this.roomHandlers['state_changed'] = handler
  }

  /**
   * 监听游戏开始倒计时
   */
  onGameStarting(handler) {
    const socket = getSocket()
    socket.on('game_starting', handler)
    this.roomHandlers['game_starting'] = handler
  }

  /**
   * 监听错误
   */
  onError(handler) {
    const socket = getSocket()
    socket.on('error', handler)
    this.roomHandlers['error'] = handler
  }

  /**
   * 发送聊天消息
   */
  sendChat(roomId, message) {
    const socket = getSocket()
    return socket.emitEvent('chat_message', { roomId, message })
  }

  /**
   * 执行游戏操作（通过Socket，实时性更好）
   */
  performAction(roomId, action, data, callback) {
    const socket = getSocket()
    return socket.emitEvent('game_action', {
      roomId,
      action,
      ...data
    }, (ack) => {
      if (callback) callback(ack)
    })
  }

  /**
   * 清除房间事件监听
   */
  clearRoomHandlers() {
    const socket = getSocket()
    Object.keys(this.roomHandlers).forEach(eventName => {
      socket.off(eventName, this.roomHandlers[eventName])
    })
    this.roomHandlers = {}
  }

  /**
   * 断开所有监听
   */
  destroy() {
    if (this.currentRoomId) {
      this.leaveRoom(this.currentRoomId)
    }
    this.clearRoomHandlers()
  }
}

// 单例
let roomSocketInstance = null

export function getRoomSocket() {
  if (!roomSocketInstance) {
    roomSocketInstance = new RoomSocketManager()
  }
  return roomSocketInstance
}

export function destroyRoomSocket() {
  if (roomSocketInstance) {
    roomSocketInstance.destroy()
    roomSocketInstance = null
  }
}

export default {
  getRoomSocket,
  destroyRoomSocket
}
