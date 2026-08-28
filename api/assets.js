/**
 * V-Poker 素材 API
 */
import { get } from './request.js'

// 获取素材列表
export function getAssets(params) {
  return get('/api/assets', params)
}

// 下载素材
export function downloadAsset(assetId) {
  return get(`/api/assets/download`, { assetId })
}

export default {
  getAssets,
  downloadAsset
}
