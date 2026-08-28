/**
 * V-Poker 通用/杂项 API
 */
import { get, post } from './request.js'

// 健康检查
export function healthCheck() {
  return get('/api/health')
}

// 清理历史数据
export function cleanupHistory(params) {
  return post('/api/history/cleanup', params)
}

// 数据种子（初始化测试数据）
export function seedData() {
  return post('/api/seed')
}

export default {
  healthCheck,
  cleanupHistory,
  seedData
}
