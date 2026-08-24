/**
 * V-Poker 代理 API
 */
import { get, post } from './request.js'

// 获取下级玩家列表
export function getAgentPlayers(params) {
  return get('/api/agent/players', params)
}

// 获取推广数据
export function getPromotionData() {
  return get('/api/agent/promotion')
}

// 升级玩家为代理
export function promotePlayer(userId) {
  return post('/api/agent/promote', { userId })
}

// 调整玩家筹码
export function adjustPlayerPoints(userId, amount, reason) {
  return post('/api/agent/adjust-points', {
    userId,
    amount,
    reason
  })
}

// 获取玩家详情
export function getPlayerDetail(userId) {
  return get(`/api/agent/players/${userId}`)
}

// 获取流水记录
export function getTransactionHistory(params) {
  return get('/api/agent/transactions', params)
}

// 获取邀请码
export function getInviteCode() {
  return get('/api/agent/invite-code')
}

// 生成新邀请码
export function generateInviteCode() {
  return post('/api/agent/invite-code/generate')
}

export default {
  getAgentPlayers,
  getPromotionData,
  promotePlayer,
  adjustPlayerPoints,
  getPlayerDetail,
  getTransactionHistory,
  getInviteCode,
  generateInviteCode
}
