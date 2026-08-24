/**
 * V-Poker 房间 API
 */
import { get, post, put } from './request.js'

// 创建房间
export function createRoom(gameType, config) {
  return post('/api/rooms/create', {
    gameType,
    ...config
  })
}

// 加入房间
export function joinRoom(roomId) {
  return post('/api/rooms/join', { roomId })
}

// 离开房间
export function leaveRoom(roomId) {
  return post('/api/rooms/leave', { roomId })
}

// 获取房间详情
export function getRoom(roomId) {
  return get(`/api/rooms/${roomId}`)
}

// 获取房间牌局状态
export function getRoomHand(roomId) {
  return get(`/api/rooms/${roomId}/hand`)
}

// 执行游戏操作
export function performAction(roomId, action, data) {
  return put(`/api/rooms/${roomId}/hand`, {
    action,
    ...data
  })
}

// 获取我创建的房间
export function getMyRooms() {
  return get('/api/rooms/mine')
}

// 获取我加入的房间
export function getJoinedRooms() {
  return get('/api/rooms/joined')
}

// 获取房间列表（大厅）
export function getRoomList(params) {
  return get('/api/rooms', params)
}

// 获取房间聊天记录
export function getRoomChat(roomId) {
  return get(`/api/rooms/${roomId}/chat`)
}

// 发送聊天消息
export function sendRoomChat(roomId, message) {
  return post(`/api/rooms/${roomId}/chat`, { message })
}

// 解散房间（房主）
export function dissolveRoom(roomId) {
  return post(`/api/rooms/${roomId}/dissolve`)
}

// 踢出玩家（房主）
export function kickPlayer(roomId, userId) {
  return post(`/api/rooms/${roomId}/kick`, { userId })
}

export default {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoom,
  getRoomHand,
  performAction,
  getMyRooms,
  getJoinedRooms,
  getRoomList,
  getRoomChat,
  sendRoomChat,
  dissolveRoom,
  kickPlayer
}
