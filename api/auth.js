/**
 * V-Poker 认证 API
 */
import { post, get, setToken, clearToken } from './request.js'

// 登录
export function login(account, password) {
  return post('/api/auth/login', { account, password })
    .then(data => {
      // 保存Token
      if (data.token) {
        setToken(data.token)
      }
      return data
    })
}

// 注册
export function register(account, password, inviteCode) {
  return post('/api/auth/register', {
    account,
    password,
    inviteCode: inviteCode || undefined
  })
}

// 获取当前用户信息
export function getMe() {
  return get('/api/auth/me')
}

// 登出
export function logout() {
  clearToken()
  return Promise.resolve()
}

// 修改密码
export function changePassword(oldPassword, newPassword) {
  return post('/api/auth/change-password', {
    oldPassword,
    newPassword
  })
}

// 检查登录状态
export function checkAuth() {
  return get('/api/auth/me', {}, { silent: true })
    .then(data => ({ isLoggedIn: true, user: data }))
    .catch(() => ({ isLoggedIn: false, user: null }))
}

export default {
  login,
  register,
  getMe,
  logout,
  changePassword,
  checkAuth
}
