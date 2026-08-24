<template>
  <view class="promotion-page theme-promotion">
    <!-- 背景 -->
    <view class="page-bg">
      <view class="bg-gradient"></view>
      <view class="bg-grid"></view>
    </view>

    <!-- 顶部导航 -->
    <view class="top-nav">
      <view class="nav-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">总代推广中心</text>
      </view>
      <view class="nav-right">
        <view class="empire-badge">
          <text class="badge-icon">👑</text>
          <text class="badge-text">总代理</text>
        </view>
      </view>
    </view>

    <!-- 主内容 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 帝国数据概览 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">帝国概览</text>
          <text class="section-subtitle">我的扑克帝国</text>
        </view>
        <view class="empire-stats">
          <view class="stat-card stat-primary" v-for="(stat, index) in empireStats" :key="index">
            <view class="stat-icon">
              <text>{{ stat.icon }}</text>
            </view>
            <view class="stat-content">
              <text class="stat-value">{{ stat.value }}</text>
              <text class="stat-label">{{ stat.label }}</text>
            </view>
            <view v-if="stat.trend" class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
              <text>{{ stat.trend > 0 ? '↑' : '↓' }}{{ Math.abs(stat.trend) }}%</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 下线关系力导向图 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">帝国版图</text>
          <view class="view-toggle">
            <text
              v-for="view in viewModes"
              :key="view.value"
              class="toggle-item"
              :class="{ active: activeView === view.value }"
              @click="activeView = view.value"
            >{{ view.label }}</text>
          </view>
        </view>
        <view class="graph-card">
          <!-- 树状图视图 -->
          <view v-if="activeView === 'tree'" class="tree-view">
            <view class="tree-node root-node">
              <view class="node-avatar root-avatar">
                <text class="avatar-text">👑</text>
              </view>
              <text class="node-name">我（总代理）</text>
              <text class="node-points">{{ formatPoints(128500) }}</text>
            </view>
            <view class="tree-children">
              <view
                v-for="agent in firstLevelAgents"
                :key="agent.id"
                class="tree-branch"
              >
                <view class="branch-line"></view>
                <view class="tree-node level1-node">
                  <view class="node-avatar">
                    <text class="avatar-text">{{ agent.nickname?.charAt(0) }}</text>
                  </view>
                  <text class="node-name">{{ agent.nickname }}</text>
                  <text class="node-points">{{ formatPoints(agent.points) }}</text>
                  <text class="node-count">{{ agent.subCount }}下线</text>
                </view>
                <view class="tree-grandchildren">
                  <view
                    v-for="sub in agent.subAgents"
                    :key="sub.id"
                    class="tree-node level2-node"
                  >
                    <view class="node-avatar small">
                      <text class="avatar-text">{{ sub.nickname?.charAt(0) }}</text>
                    </view>
                    <text class="node-name">{{ sub.nickname }}</text>
                    <text class="node-points">{{ formatPoints(sub.points) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 力导向图视图（简化版） -->
          <view v-else class="force-view">
            <view class="force-container">
              <view
                v-for="node in forceNodes"
                :key="node.id"
                class="force-node"
                :style="{ left: node.x + '%', top: node.y + '%', transform: `scale(${node.scale})` }"
                :class="node.level"
              >
                <text class="force-avatar">{{ node.icon }}</text>
                <text class="force-name">{{ node.name }}</text>
              </view>
              <view
                v-for="(link, index) in forceLinks"
                :key="index"
                class="force-link"
                :style="getLinkStyle(link)"
              ></view>
            </view>
            <view class="force-legend">
              <view class="legend-item">
                <view class="legend-dot level-root"></view>
                <text>总代理</text>
              </view>
              <view class="legend-item">
                <view class="legend-dot level-1"></view>
                <text>一级代理</text>
              </view>
              <view class="legend-item">
                <view class="legend-dot level-2"></view>
                <text>二级代理/玩家</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 收益分配金字塔 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">收益分配</text>
          <text class="section-link" @click="viewDistributionDetail">查看详情</text>
        </view>
        <view class="pyramid-card">
          <view class="pyramid-visual">
            <view class="pyramid-level level-platform">
              <text class="level-name">平台</text>
              <text class="level-amount">1%</text>
            </view>
            <view class="pyramid-level level-general">
              <text class="level-name">总代理</text>
              <text class="level-amount">0.5%</text>
            </view>
            <view class="pyramid-level level-first">
              <text class="level-name">一级代理</text>
              <text class="level-amount">0.5%</text>
            </view>
            <view class="pyramid-level level-room">
              <text class="level-name">开房代理</text>
              <text class="level-amount">1%</text>
            </view>
            <view class="pyramid-base">
              <text class="base-text">抽水总额 3%</text>
            </view>
          </view>
          <view class="pyramid-info">
            <view class="info-item">
              <text class="info-label">今日抽水</text>
              <text class="info-value">3,250</text>
            </view>
            <view class="info-item">
              <text class="info-label">我的收益</text>
              <text class="info-value highlight">542</text>
            </view>
            <view class="info-item">
              <text class="info-label">累计收益</text>
              <text class="info-value">28,560</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 代理管理列表 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">代理管理</text>
          <view class="header-actions">
            <view class="invite-btn" @click="showInviteModal = true">
              <text>生成邀请码</text>
            </view>
          </view>
        </view>
        <view class="agent-list">
          <view
            v-for="agent in allAgents"
            :key="agent.id"
            class="agent-card"
            @click="viewAgentDetail(agent)"
          >
            <view class="agent-avatar" :style="{ background: getAvatarColor(agent.nickname) }">
              <text class="avatar-text">{{ agent.nickname?.charAt(0) }}</text>
            </view>
            <view class="agent-info">
              <view class="agent-name-row">
                <text class="agent-name">{{ agent.nickname }}</text>
                <text class="agent-level" :class="agent.level">{{ agent.level === 1 ? '一级' : '二级' }}</text>
              </view>
              <text class="agent-account">{{ agent.account }}</text>
              <view class="agent-meta">
                <text class="meta-item">下线: {{ agent.subCount }}</text>
                <text class="meta-item">局数: {{ agent.gameCount }}</text>
              </view>
            </view>
            <view class="agent-stats">
              <text class="stat-label">贡献</text>
              <text class="stat-value">{{ formatPoints(agent.contribution) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-spacing"></view>
    </scroll-view>

    <!-- 邀请码弹窗 -->
    <view v-if="showInviteModal" class="modal-overlay" @click="showInviteModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">生成邀请码</text>
          <text class="modal-close" @click="showInviteModal = false">✕</text>
        </view>
        <view class="invite-form">
          <view class="form-group">
            <text class="form-label">邀请层级</text>
            <view class="level-group">
              <view
                v-for="level in inviteLevels"
                :key="level.value"
                class="level-btn"
                :class="{ active: inviteLevel === level.value }"
                @click="inviteLevel = level.value"
              >
                <text>{{ level.label }}</text>
              </view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">备注（可选）</text>
            <input class="form-input" v-model="inviteRemark" placeholder="请输入备注" />
          </view>
        </view>
        <view class="invite-result" v-if="generatedCode">
          <text class="result-label">邀请码</text>
          <text class="result-code">{{ generatedCode }}</text>
          <view class="copy-btn" @click="copyCode">
            <text>复制</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="showInviteModal = false">取消</button>
          <button class="btn-confirm" @click="generateCode">生成</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatPoints } from '../../utils/format.js'

export default {
  name: 'PromotionCenter',
  data() {
    return {
      activeView: 'tree',
      viewModes: [
        { label: '树状图', value: 'tree' },
        { label: '力导向图', value: 'force' },
      ],
      showInviteModal: false,
      inviteLevel: 1,
      inviteRemark: '',
      generatedCode: '',
      inviteLevels: [
        { label: '一级代理', value: 1 },
        { label: '二级代理', value: 2 },
        { label: '普通玩家', value: 0 },
      ],
      empireStats: [
        { icon: '👥', label: '总下线', value: '156', trend: 12.5 },
        { icon: '🎮', label: '今日局数', value: '1,256', trend: 8.3 },
        { icon: '💰', label: '今日收益', value: '542', trend: 15.8 },
        { icon: '📊', label: '累计收益', value: '28.5K', trend: 22.1 },
      ],
      firstLevelAgents: [
        { id: 1, nickname: '代理A', account: 'agent001', points: 45000, subCount: 23, subAgents: [
          { id: 11, nickname: '玩家A1', points: 12000 },
          { id: 12, nickname: '玩家A2', points: 8500 },
        ]},
        { id: 2, nickname: '代理B', account: 'agent002', points: 38000, subCount: 18, subAgents: [
          { id: 21, nickname: '玩家B1', points: 15000 },
        ]},
        { id: 3, nickname: '代理C', account: 'agent003', points: 28000, subCount: 12, subAgents: [
          { id: 31, nickname: '玩家C1', points: 9800 },
          { id: 32, nickname: '玩家C2', points: 7600 },
        ]},
      ],
      allAgents: [
        { id: 1, nickname: '代理A', account: 'agent001', level: 1, subCount: 23, gameCount: 456, contribution: 12500 },
        { id: 2, nickname: '代理B', account: 'agent002', level: 1, subCount: 18, gameCount: 389, contribution: 9800 },
        { id: 3, nickname: '代理C', account: 'agent003', level: 1, subCount: 12, gameCount: 278, contribution: 7600 },
        { id: 11, nickname: '玩家A1', account: 'user011', level: 2, subCount: 0, gameCount: 156, contribution: 3200 },
        { id: 21, nickname: '玩家B1', account: 'user021', level: 2, subCount: 0, gameCount: 189, contribution: 4100 },
      ],
      forceNodes: [
        { id: 0, name: '我', icon: '👑', x: 50, y: 20, scale: 1.5, level: 'root' },
        { id: 1, name: '代理A', icon: 'A', x: 25, y: 50, scale: 1.2, level: 'level-1' },
        { id: 2, name: '代理B', icon: 'B', x: 50, y: 55, scale: 1.2, level: 'level-1' },
        { id: 3, name: '代理C', icon: 'C', x: 75, y: 50, scale: 1.2, level: 'level-1' },
        { id: 4, name: '玩家A1', icon: '1', x: 15, y: 75, scale: 0.9, level: 'level-2' },
        { id: 5, name: '玩家A2', icon: '2', x: 30, y: 80, scale: 0.9, level: 'level-2' },
        { id: 6, name: '玩家B1', icon: '3', x: 50, y: 82, scale: 0.9, level: 'level-2' },
        { id: 7, name: '玩家C1', icon: '4', x: 70, y: 80, scale: 0.9, level: 'level-2' },
        { id: 8, name: '玩家C2', icon: '5', x: 85, y: 75, scale: 0.9, level: 'level-2' },
      ],
      forceLinks: [
        { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
        { from: 1, to: 4 }, { from: 1, to: 5 },
        { from: 2, to: 6 },
        { from: 3, to: 7 }, { from: 3, to: 8 },
      ],
    }
  },
  methods: {
    formatPoints,
    goBack() {
      uni.navigateBack()
    },
    getAvatarColor(name) {
      const colors = [
        'linear-gradient(135deg, #6B46C1, #553C9A)',
        'linear-gradient(135deg, #805AD5, #6B46C1)',
        'linear-gradient(135deg, #9F7AEA, #805AD5)',
        'linear-gradient(135deg, #553C9A, #44337A)',
      ]
      let hash = 0
      for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      return colors[Math.abs(hash) % colors.length]
    },
    getLinkStyle(link) {
      const from = this.forceNodes.find(n => n.id === link.from)
      const to = this.forceNodes.find(n => n.id === link.to)
      if (!from || !to) return {}
      const dx = to.x - from.x
      const dy = to.y - from.y
      const length = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx) * 180 / Math.PI
      return {
        left: from.x + '%',
        top: from.y + '%',
        width: length + '%',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left center',
      }
    },
    viewDistributionDetail() {
      uni.showToast({ title: '查看分配详情', icon: 'none' })
    },
    viewAgentDetail(agent) {
      uni.showToast({ title: `查看 ${agent.nickname}`, icon: 'none' })
    },
    generateCode() {
      this.generatedCode = 'VP' + Math.random().toString(36).substring(2, 8).toUpperCase()
      uni.showToast({ title: '生成成功', icon: 'success' })
    },
    copyCode() {
      uni.setClipboardData({
        data: this.generatedCode,
        success: () => {
          uni.showToast({ title: '已复制', icon: 'success' })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.promotion-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0f0a1a;
}

.theme-promotion {
  --primary-color: #6B46C1;
  --primary-gradient: linear-gradient(135deg, #6B46C1, #553C9A);
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top, rgba(107, 70, 193, 0.15) 0%, transparent 50%),
              linear-gradient(180deg, #1a0f2e 0%, #0f0a1a 100%);
}

.bg-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(107, 70, 193, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(107, 70, 193, 0.05) 1px, transparent 1px);
  background-size: 40rpx 40rpx;
}

.top-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  background: rgba(26, 15, 46, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(107, 70, 193, 0.2);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.back-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.back-icon {
  font-size: 24rpx;
  color: #e8e8e8;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #9F7AEA;
}

.empire-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.3), rgba(85, 60, 154, 0.3));
  border: 1px solid rgba(159, 122, 234, 0.4);
  border-radius: 20rpx;
}

.badge-icon {
  font-size: 24rpx;
}

.badge-text {
  font-size: 22rpx;
  color: #D6BCFA;
  font-weight: 600;
}

.main-content {
  position: relative;
  z-index: 1;
  height: calc(100vh - 80rpx);
  padding: 24rpx;
}

.section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.section-subtitle {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 12rpx;
}

.section-link {
  font-size: 22rpx;
  color: #9F7AEA;
}

/* 帝国统计 */
.empire-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: rgba(107, 70, 193, 0.1);
  border: 1px solid rgba(107, 70, 193, 0.2);
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  background: rgba(107, 70, 193, 0.2);
  border-radius: 10rpx;
  margin-right: 12rpx;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.stat-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
}

.stat-trend {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  font-size: 16rpx;
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}

.stat-trend.up {
  color: #4ADE80;
  background: rgba(74, 222, 128, 0.1);
}

.stat-trend.down {
  color: #F87171;
  background: rgba(248, 113, 113, 0.1);
}

/* 视图切换 */
.view-toggle {
  display: flex;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.05);
  padding: 4rpx;
  border-radius: 8rpx;
}

.toggle-item {
  padding: 8rpx 16rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 6rpx;
  transition: all 0.2s;
}

.toggle-item.active {
  background: rgba(107, 70, 193, 0.3);
  color: #9F7AEA;
}

/* 图形容器 */
.graph-card {
  background: rgba(107, 70, 193, 0.08);
  border: 1px solid rgba(107, 70, 193, 0.2);
  border-radius: 16rpx;
  padding: 24rpx;
  min-height: 400rpx;
}

/* 树状图 */
.tree-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.root-node {
  margin-bottom: 32rpx;
}

.tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx;
  border-radius: 12rpx;
  min-width: 120rpx;
}

.root-avatar {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.5);
}

.level1-node {
  background: rgba(107, 70, 193, 0.2);
  border: 1px solid rgba(159, 122, 234, 0.4);
}

.level2-node {
  background: rgba(107, 70, 193, 0.1);
  border: 1px solid rgba(107, 70, 193, 0.2);
  transform: scale(0.85);
}

.node-avatar {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #6B46C1, #553C9A);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-avatar.small {
  width: 36rpx;
  height: 36rpx;
}

.avatar-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #fff;
}

.node-name {
  font-size: 20rpx;
  color: #e8e8e8;
  font-weight: 600;
}

.node-points {
  font-size: 16rpx;
  color: #9F7AEA;
}

.node-count {
  font-size: 14rpx;
  color: rgba(255, 255, 255, 0.4);
}

.tree-children {
  display: flex;
  gap: 24rpx;
  width: 100%;
  justify-content: center;
}

.tree-branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.branch-line {
  width: 2rpx;
  height: 24rpx;
  background: rgba(107, 70, 193, 0.3);
}

.tree-grandchildren {
  display: flex;
  gap: 8rpx;
  margin-top: 8rpx;
}

/* 力导向图 */
.force-view {
  position: relative;
  height: 350rpx;
}

.force-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.force-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.force-node.root {
  .force-avatar {
    width: 56rpx;
    height: 56rpx;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    font-size: 24rpx;
    box-shadow: 0 0 16rpx rgba(255, 215, 0, 0.5);
  }
}

.force-node.level-1 {
  .force-avatar {
    width: 44rpx;
    height: 44rpx;
    background: linear-gradient(135deg, #9F7AEA, #6B46C1);
    font-size: 20rpx;
  }
}

.force-node.level-2 {
  .force-avatar {
    width: 32rpx;
    height: 32rpx;
    background: linear-gradient(135deg, #553C9A, #44337A);
    font-size: 16rpx;
  }
  .force-name {
    font-size: 14rpx;
  }
}

.force-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
}

.force-name {
  font-size: 16rpx;
  color: #e8e8e8;
  white-space: nowrap;
}

.force-link {
  position: absolute;
  height: 2rpx;
  background: rgba(107, 70, 193, 0.3);
  z-index: 1;
}

.force-legend {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  margin-top: 16rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.5);
}

.legend-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.legend-dot.level-root {
  background: #FFD700;
}

.legend-dot.level-1 {
  background: #9F7AEA;
}

.legend-dot.level-2 {
  background: #553C9A;
}

/* 收益金字塔 */
.pyramid-card {
  display: flex;
  gap: 24rpx;
  background: rgba(107, 70, 193, 0.08);
  border: 1px solid rgba(107, 70, 193, 0.2);
  border-radius: 16rpx;
  padding: 24rpx;
}

.pyramid-visual {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pyramid-level {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 16rpx;
  margin-bottom: 4rpx;
  border-radius: 6rpx;
  width: 80%;
}

.level-platform {
  background: rgba(99, 179, 237, 0.2);
  border: 1px solid rgba(99, 179, 237, 0.4);
  width: 60%;
}

.level-general {
  background: rgba(159, 122, 234, 0.2);
  border: 1px solid rgba(159, 122, 234, 0.4);
  width: 70%;
}

.level-first {
  background: rgba(107, 70, 193, 0.2);
  border: 1px solid rgba(107, 70, 193, 0.4);
  width: 80%;
}

.level-room {
  background: rgba(85, 60, 154, 0.2);
  border: 1px solid rgba(85, 60, 154, 0.4);
  width: 90%;
}

.level-name {
  font-size: 18rpx;
  color: #e8e8e8;
}

.level-amount {
  font-size: 20rpx;
  font-weight: 700;
  color: #9F7AEA;
}

.pyramid-base {
  margin-top: 8rpx;
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.3), rgba(85, 60, 154, 0.3));
  border-radius: 6rpx;
}

.base-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #D6BCFA;
}

.pyramid-info {
  width: 200rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.info-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
}

.info-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #e8e8e8;
}

.info-value.highlight {
  color: #9F7AEA;
  font-size: 36rpx;
}

/* 代理列表 */
.header-actions {
  display: flex;
  gap: 12rpx;
}

.invite-btn {
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #6B46C1, #553C9A);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #fff;
}

.agent-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.agent-card {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: rgba(107, 70, 193, 0.08);
  border: 1px solid rgba(107, 70, 193, 0.15);
  border-radius: 12rpx;
  gap: 16rpx;
}

.agent-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-info {
  flex: 1;
  min-width: 0;
}

.agent-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 4rpx;
}

.agent-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #e8e8e8;
}

.agent-level {
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  font-size: 16rpx;
}

.agent-level.level-1 {
  background: rgba(159, 122, 234, 0.2);
  color: #9F7AEA;
}

.agent-level.level-2 {
  background: rgba(107, 70, 193, 0.2);
  color: #6B46C1;
}

.agent-account {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4rpx;
}

.agent-meta {
  display: flex;
  gap: 16rpx;
}

.meta-item {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
}

.agent-stats {
  text-align: right;
  flex-shrink: 0;
}

.agent-stats .stat-label {
  display: block;
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4rpx;
}

.agent-stats .stat-value {
  font-size: 24rpx;
  font-weight: 700;
  color: #9F7AEA;
}

.bottom-spacing {
  height: 40rpx;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  width: 80%;
  max-width: 600rpx;
  background: #1a0f2e;
  border-radius: 16rpx;
  border: 1px solid rgba(107, 70, 193, 0.3);
  padding: 28rpx;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #9F7AEA;
}

.modal-close {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 10rpx;
}

.invite-form {
  margin-bottom: 20rpx;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  font-size: 24rpx;
  color: #CBD5E0;
  margin-bottom: 12rpx;
}

.level-group {
  display: flex;
  gap: 12rpx;
}

.level-btn {
  flex: 1;
  padding: 14rpx;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.level-btn.active {
  background: rgba(107, 70, 193, 0.2);
  border-color: #9F7AEA;
  color: #9F7AEA;
}

.form-input {
  width: 100%;
  height: 72rpx;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
  color: #e8e8e8;
}

.invite-result {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background: rgba(107, 70, 193, 0.1);
  border: 1px dashed rgba(159, 122, 234, 0.4);
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.result-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.result-code {
  flex: 1;
  font-size: 32rpx;
  font-weight: 700;
  color: #9F7AEA;
  letter-spacing: 4rpx;
}

.copy-btn {
  padding: 8rpx 16rpx;
  background: rgba(107, 70, 193, 0.2);
  border-radius: 6rpx;
  font-size: 20rpx;
  color: #9F7AEA;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #CBD5E0;
}

.btn-confirm {
  background: linear-gradient(135deg, #6B46C1, #553C9A);
  color: #fff;
  font-weight: 600;
}
</style>
