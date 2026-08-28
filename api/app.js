/**
 * V-Poker 应用相关 API
 */
import { get, post } from './request.js'

// 获取经济费率
export function getEconRates() {
  return get('/api/app/econ-rates')
}

// 上报错误
export function reportError(errorData) {
  return post('/api/app/error', errorData)
}

// 获取应用版本信息
export function getAppVersion() {
  return get('/api/app/version')
}

// 获取APP下载地址
export function getAppDownload() {
  return get('/api/app-download')
}

// 获取APP版本（独立接口）
export function getAppVersionInfo() {
  return get('/api/app-version')
}

export default {
  getEconRates,
  reportError,
  getAppVersion,
  getAppDownload,
  getAppVersionInfo
}
