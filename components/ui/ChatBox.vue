<template>
  <view class="chat-box" :class="{ 'chat-collapsed': collapsed }">
    <!-- 折叠/展开按钮 -->
    <view class="chat-toggle" @click="collapsed = !collapsed">
      <text class="toggle-icon">{{ collapsed ? '💬' : '✕' }}</text>
    </view>

    <!-- 聊天内容 -->
    <view v-show="!collapsed" class="chat-content">
      <!-- 消息列表 -->
      <scroll-view
        class="chat-messages"
        scroll-y
        :scroll-into-view="scrollToId"
        :scroll-with-animation="true"
      >
        <view
          v-for="(msg, index) in messages"
          :key="index"
          :id="'msg-' + index"
          class="chat-message"
          :class="{ 'msg-system': msg.type === 'system', 'msg-self': msg.isSelf }"
        >
          <text v-if="msg.type === 'system'" class="msg-system-text">{{ msg.content }}</text>
          <template v-else>
            <text class="msg-sender">{{ msg.senderName }}:</text>
            <text class="msg-content">{{ msg.content }}</text>
          </template>
        </view>
      </scroll-view>

      <!-- 输入区域 -->
      <view class="chat-input-area">
        <input
          class="chat-input"
          v-model="inputText"
          placeholder="说点什么..."
          placeholder-class="input-placeholder"
          :maxlength="50"
          @confirm="sendMessage"
        />
        <view class="send-btn" :class="{ 'send-active': inputText }" @click="sendMessage">
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ChatBox',
  props: {
    // 消息列表
    messages: {
      type: Array,
      default: () => []
    },
    // 是否默认折叠
    defaultCollapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send'],
  data() {
    return {
      collapsed: this.defaultCollapsed,
      inputText: '',
      scrollToId: ''
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          if (this.messages.length > 0) {
            this.scrollToId = 'msg-' + (this.messages.length - 1)
          }
        })
      },
      deep: true
    }
  },
  methods: {
    sendMessage() {
      const text = this.inputText.trim()
      if (!text) return
      this.$emit('send', text)
      this.inputText = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-box {
  position: absolute;
  left: 20rpx;
  bottom: 20rpx;
  width: 360rpx;
  height: 320rpx;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  overflow: hidden;
  z-index: 30;
  transition: all 0.3s ease;
}

.chat-collapsed {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

/* 折叠按钮 */
.chat-toggle {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 10;
}

.toggle-icon {
  font-size: 20rpx;
}

.chat-collapsed .chat-toggle {
  position: static;
  width: 100%;
  height: 100%;
  background: rgba(255, 215, 0, 0.2);
}

.chat-collapsed .toggle-icon {
  font-size: 28rpx;
}

/* 聊天内容 */
.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 48rpx;
}

/* 消息列表 */
.chat-messages {
  flex: 1;
  padding: 8rpx 12rpx;
}

.chat-message {
  margin-bottom: 8rpx;
  font-size: 20rpx;
  line-height: 1.4;
  word-break: break-all;
}

.msg-system {
  text-align: center;
}

.msg-system-text {
  font-size: 18rpx;
  color: rgba(255, 215, 0, 0.7);
  font-style: italic;
}

.msg-sender {
  color: #FFD700;
  font-weight: 600;
  margin-right: 4rpx;
}

.msg-self .msg-sender {
  color: #4ADE80;
}

.msg-content {
  color: rgba(255, 255, 255, 0.85);
}

/* 输入区域 */
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 12rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input {
  flex: 1;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8rpx;
  padding: 0 12rpx;
  font-size: 20rpx;
  color: #e8e8e8;
}

.input-placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.send-btn {
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.send-active {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
}
</style>
