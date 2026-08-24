/**
 * V-Poker WebSocket 封装
 * 支持 Socket.io 协议，兼容 uni-app APP/H5
 */
import { API_CONFIG } from '../api/config.js'

// Socket 单例
let socketInstance = null
let reconnectTimer = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 10

// 事件监听器存储
const eventListeners = {}

/**
 * 获取Token
 */
function getToken() {
  try {
    return uni.getStorageSync(API_CONFIG.tokenKey) || ''
  } catch (e) {
    return ''
  }
}

/**
 * 创建Socket连接
 */
function createSocket() {
  const token = getToken()
  const wsUrl = API_CONFIG.baseUrl.replace(/^http/, 'ws') + '/socket.io/?EIO=4&transport=websocket'

  // 使用 uni.connectSocket
  const socketTask = uni.connectSocket({
    url: wsUrl,
    header: {
      'Authorization': token ? 'Bearer ' + token : '',
      'x-vpoker-token': token,
    },
    protocols: [],
    complete: () => {}
  })

  return socketTask
}

/**
 * Socket 管理器
 */
class SocketManager {
  constructor() {
    this.socketTask = null
    this.connected = false
    this.socketId = null
    this.heartbeatTimer = null
    this.eventHandlers = {}
  }

  /**
   * 连接
   */
  connect() {
    if (this.connected) {
      console.log('[Socket] 已连接')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        this.socketTask = createSocket()

        // 连接成功
        this.socketTask.onOpen(() => {
          console.log('[Socket] 连接成功')
          this.connected = true
          reconnectAttempts = 0
          this.startHeartbeat()
          this.emit('connect', { socketId: this.socketId })
          resolve()
        })

        // 接收消息
        this.socketTask.onMessage((res) => {
          this.handleMessage(res.data)
        })

        // 连接关闭
        this.socketTask.onClose(() => {
          console.log('[Socket] 连接关闭')
          this.connected = false
          this.stopHeartbeat()
          this.emit('disconnect', {})
          this.tryReconnect()
        })

        // 连接错误
        this.socketTask.onError((err) => {
          console.error('[Socket] 连接错误', err)
          this.connected = false
          this.emit('error', err)
          reject(err)
        })

      } catch (e) {
        console.error('[Socket] 创建连接失败', e)
        reject(e)
      }
    })
  }

  /**
   * 处理消息
   */
  handleMessage(data) {
    try {
      // Socket.io 协议解析
      // 40 = 连接确认, 42 = 事件, 44 = 错误
      if (typeof data === 'string') {
        if (data.startsWith('40')) {
          // 连接确认
          const sidMatch = data.match(/"sid":"([^"]+)"/)
          if (sidMatch) {
            this.socketId = sidMatch[1]
          }
          this.emit('connect', { socketId: this.socketId })
        } else if (data.startsWith('42')) {
          // 事件消息
          const jsonStr = data.substring(2)
          const parsed = JSON.parse(jsonStr)
          const eventName = parsed[0]
          const eventData = parsed[1]
          this.emit(eventName, eventData)
        } else if (data.startsWith('2')) {
          // Ping
          this.send('3') // Pong
        }
      }
    } catch (e) {
      console.error('[Socket] 消息解析失败', e, data)
    }
  }

  /**
   * 发送消息
   */
  send(data) {
    if (!this.connected || !this.socketTask) {
      console.warn('[Socket] 未连接，无法发送')
      return false
    }
    try {
      this.socketTask.send({ data })
      return true
    } catch (e) {
      console.error('[Socket] 发送失败', e)
      return false
    }
  }

  /**
   * 发送事件
   */
  emitEvent(eventName, data, callback) {
    const message = '42' + JSON.stringify([eventName, data || {}])
    const result = this.send(message)

    if (callback && result) {
      // 简单的ack机制（等待一次响应）
      const ackEvent = '__ack_' + eventName + '_' + Date.now()
      const handler = (res) => {
        this.off(ackEvent, handler)
        callback(res)
      }
      this.on(ackEvent, handler)
      // 超时
      setTimeout(() => {
        this.off(ackEvent, handler)
      }, 10000)
    }

    return result
  }

  /**
   * 监听事件
   */
  on(eventName, handler) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = []
    }
    this.eventHandlers[eventName].push(handler)
  }

  /**
   * 取消监听
   */
  off(eventName, handler) {
    if (!this.eventHandlers[eventName]) return
    if (handler) {
      this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(h => h !== handler)
    } else {
      delete this.eventHandlers[eventName]
    }
  }

  /**
   * 触发事件
   */
  emit(eventName, data) {
    const handlers = this.eventHandlers[eventName]
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (e) {
          console.error('[Socket] 事件处理错误', eventName, e)
        }
      })
    }
  }

  /**
   * 开始心跳
   */
  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.connected) {
        this.send('2') // Ping
      }
    }, 25000)
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 尝试重连
   */
  tryReconnect() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('[Socket] 达到最大重连次数')
      this.emit('reconnect_failed', {})
      return
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
    reconnectAttempts++

    console.log(`[Socket] ${delay}ms后尝试第${reconnectAttempts}次重连`)

    reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // 重连失败会自动触发下一次
      })
    }, delay)
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.stopHeartbeat()
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (this.socketTask) {
      this.socketTask.close()
      this.socketTask = null
    }
    this.connected = false
    this.eventHandlers = {}
  }
}

/**
 * 获取Socket单例
 */
export function getSocket() {
  if (!socketInstance) {
    socketInstance = new SocketManager()
  }
  return socketInstance
}

/**
 * 连接Socket
 */
export function connectSocket() {
  return getSocket().connect()
}

/**
 * 断开Socket
 */
export function disconnectSocket() {
  getSocket().disconnect()
  socketInstance = null
}

export default {
  getSocket,
  connectSocket,
  disconnectSocket
}
