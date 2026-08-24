/**
 * V-Poker 个人资料 API
 */
import { get, put } from './request.js'

// 获取个人资料
export function getProfile() {
  return get('/api/profile')
}

// 更新个人资料
export function updateProfile(data) {
  return put('/api/profile', data)
}

// 修改昵称
export function updateNickname(nickname) {
  return put('/api/profile/nickname', { nickname })
}

// 修改头像
export function updateAvatar(avatarUrl) {
  return put('/api/profile/avatar', { avatar: avatarUrl })
}

// 获取我的筹码记录
export function getMyPointsHistory(params) {
  return get('/api/profile/points-history', params)
}

// 获取我的游戏记录
export function getMyGameHistory(params) {
  return get('/api/profile/game-history', params)
}

// 绑定手机号
export function bindPhone(phone, code) {
  return put('/api/profile/bind-phone', { phone, code })
}

// 发送验证码
export function sendVerifyCode(phone) {
  return post('/api/profile/send-code', { phone })
}

export default {
  getProfile,
  updateProfile,
  updateNickname,
  updateAvatar,
  getMyPointsHistory,
  getMyGameHistory,
  bindPhone,
  sendVerifyCode
}
