/**
 * V-Poker API 请求封装
 * 支持 Token 认证、错误处理、设备ID
 */
import { API_CONFIG } from './config.js'

// 获取Token
function getToken() {
  try {
    return uni.getStorageSync(API_CONFIG.tokenKey) || ''
  } catch (e) {
    return ''
  }
}

// 保存Token
export function setToken(token) {
  try {
    uni.setStorageSync(API_CONFIG.tokenKey, token)
  } catch (e) {
    console.error('[API] 保存Token失败', e)
  }
}

// 清除Token
export function clearToken() {
  try {
    uni.removeStorageSync(API_CONFIG.tokenKey)
  } catch (e) {
    console.error('[API] 清除Token失败', e)
  }
}

// 获取设备ID
function getDeviceId() {
  try {
    let deviceId = uni.getStorageSync(API_CONFIG.deviceIdKey)
    if (!deviceId) {
      // 生成唯一设备ID
      deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      uni.setStorageSync(API_CONFIG.deviceIdKey, deviceId)
    }
    return deviceId
  } catch (e) {
    return 'dev_unknown'
  }
}

// 请求拦截器
function requestInterceptor(options) {
  const token = getToken()
  const deviceId = getDeviceId()

  // 设置请求头
  options.header = options.header || {}

  // Content-Type
  if (!options.header['Content-Type']) {
    options.header['Content-Type'] = 'application/json'
  }

  // Token认证（优先Authorization，兼容x-vpoker-token）
  if (token) {
    options.header['Authorization'] = 'Bearer ' + token
    options.header['x-vpoker-token'] = token
  }

  // 设备ID
  options.header['x-device-id'] = deviceId

  // APP版本
  options.header['x-app-version'] = '1.0.0'

  return options
}

// 响应拦截器
function responseInterceptor(response) {
  const { statusCode, data } = response

  // 网络错误
  if (statusCode === 0) {
    return {
      success: false,
      error: '网络连接失败，请检查网络',
      statusCode: 0
    }
  }

  // 401未授权
  if (statusCode === 401) {
    clearToken()
    // 跳转到登录页
    uni.reLaunch({ url: '/pages/login/login' })
    return {
      success: false,
      error: '登录已过期，请重新登录',
      statusCode: 401
    }
  }

  // 403禁止访问
  if (statusCode === 403) {
    return {
      success: false,
      error: '没有权限执行此操作',
      statusCode: 403
    }
  }

  // 404
  if (statusCode === 404) {
    return {
      success: false,
      error: '请求的资源不存在',
      statusCode: 404
    }
  }

  // 500服务器错误
  if (statusCode >= 500) {
    return {
      success: false,
      error: '服务器繁忙，请稍后重试',
      statusCode: statusCode
    }
  }

  // 成功响应
  if (statusCode >= 200 && statusCode < 300) {
    // 如果后端返回了error字段
    if (data && data.error) {
      return {
        success: false,
        error: data.error,
        data: data,
        statusCode: statusCode
      }
    }
    return {
      success: true,
      data: data,
      statusCode: statusCode
    }
  }

  // 其他状态码
  return {
    success: false,
    error: data?.error || '请求失败',
    data: data,
    statusCode: statusCode
  }
}

// 核心请求方法
function request(options) {
  return new Promise((resolve, reject) => {
    // 请求拦截
    const finalOptions = requestInterceptor({
      url: API_CONFIG.baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      timeout: API_CONFIG.timeout,
    })

    uni.request({
      ...finalOptions,
      success: (response) => {
        const result = responseInterceptor(response)
        if (result.success) {
          resolve(result.data)
        } else {
          // 显示错误提示（除非静默）
          if (!options.silent) {
            uni.showToast({
              title: result.error,
              icon: 'none',
              duration: 2000
            })
          }
          reject(result)
        }
      },
      fail: (error) => {
        const result = {
          success: false,
          error: '网络请求失败',
          statusCode: 0,
          raw: error
        }
        if (!options.silent) {
          uni.showToast({
            title: '网络连接失败',
            icon: 'none',
            duration: 2000
          })
        }
        reject(result)
      }
    })
  })
}

// GET请求
export function get(url, data, options = {}) {
  return request({ url, method: 'GET', data, ...options })
}

// POST请求
export function post(url, data, options = {}) {
  return request({ url, method: 'POST', data, ...options })
}

// PUT请求
export function put(url, data, options = {}) {
  return request({ url, method: 'PUT', data, ...options })
}

// DELETE请求
export function del(url, data, options = {}) {
  return request({ url, method: 'DELETE', data, ...options })
}

export default {
  get,
  post,
  put,
  del,
  setToken,
  clearToken,
  getToken: () => getToken()
}
