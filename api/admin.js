/**
 * V-Poker 管理后台 API
 */
import { get, post, put, del } from './request.js'

// 获取平台统计数据
export function getAdminStats() {
  return get('/api/admin/stats')
}

// 获取用户列表
export function getUserList(params) {
  return get('/api/admin/users', params)
}

// 获取用户详情
export function getUserDetail(userId) {
  return get(`/api/admin/users/${userId}`)
}

// 创建用户
export function createUser(data) {
  return post('/api/admin/users', data)
}

// 更新用户
export function updateUser(userId, data) {
  return put(`/api/admin/users/${userId}`, data)
}

// 删除用户
export function deleteUser(userId) {
  return del(`/api/admin/users/${userId}`)
}

// 调整用户筹码
export function adjustUserPoints(userId, amount, reason) {
  return post('/api/admin/adjust-points', {
    userId,
    amount,
    reason
  })
}

// 获取房间列表
export function getAdminRoomList(params) {
  return get('/api/admin/rooms', params)
}

// 强制结束房间
export function forceEndRoom(roomId) {
  return post(`/api/admin/rooms/${roomId}/force-end`)
}

// 获取审计日志
export function getAuditLogs(params) {
  return get('/api/admin/audit-logs', params)
}

// 获取系统配置
export function getSystemConfig() {
  return get('/api/admin/config')
}

// 更新系统配置
export function updateSystemConfig(config) {
  return put('/api/admin/config', config)
}

export default {
  getAdminStats,
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  adjustUserPoints,
  getAdminRoomList,
  forceEndRoom,
  getAuditLogs,
  getSystemConfig,
  updateSystemConfig
}
