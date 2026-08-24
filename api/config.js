/**
 * V-Poker API 配置
 */

// API基础地址
// 开发环境：http://localhost:3001
// 生产环境：https://api.yourdomain.com
const BASE_URL = 'http://localhost:3001'

export const API_CONFIG = {
  baseUrl: BASE_URL,
  timeout: 15000,
  tokenKey: 'vpoker_token',
  deviceIdKey: 'vpoker_device_id',
}

export default API_CONFIG
