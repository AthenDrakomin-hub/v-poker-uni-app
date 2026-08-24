# V-Poker UNI-APP · 横屏沉浸式扑克竞技平台

> Vue 3 + uni-app 跨端框架 · 横屏16:9沉浸式体验 · 五大游戏主题 · Socket.io 实时对战

[![uni-app](https://img.shields.io/badge/uni--app-3.0+-34B7F2?style=flat-square&logo=vuedotjs)](https://uniapp.dcloud.io/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)

---

## ✨ 核心亮点

| 特性 | 说明 |
|------|------|
| **横屏沉浸** | 强制16:9横屏布局，设计基准1920×1080 |
| **五大主题** | 紫禁之巅·江南百景·机械迷城·雾都夜话·华尔街之狼 |
| **实时对战** | Socket.io WebSocket 双向通信 |
| **鎏金结算** | 倒金字塔V3抽水分配动画可视化 |
| **多角色工作台** | 代理/客服/总代/管理四种人格化界面 |

---

## 🎮 游戏主题

| 游戏 | 主题名 | 视觉风格 | 状态 |
|------|--------|----------|------|
| 抢庄牛牛 | 《紫禁之巅·斗兽场》 | 黑金帝王气场 | 待实现 |
| 抢庄三公 | 《江南百景·青玉案》 | 月白天青水墨意境 | 待实现 |
| 通比牛牛 | 《机械迷城·流水线》 | 蒸汽朋克工业风 | 待实现 |
| 炸金花 | 《雾都夜话·黑胶密房》 | 聚光灯暗影心理战 | 待实现 |
| 德州扑克 | 《华尔街之狼·信息交易所》 | 半透明玻璃数据风 | 待实现 |

详细设计方案见 [DESIGN.md](./DESIGN.md)

---

## 📂 项目结构

```
v-poker-uni-app/
├── api/                    # API层
│   ├── config.js           # API配置（BASE_URL切换）
│   ├── request.js          # 请求封装（Token/错误处理/设备ID）
│   ├── auth.js             # 认证接口（登录/注册/刷新）
│   ├── rooms.js            # 房间接口（创建/加入/列表）
│   ├── agent.js            # 代理接口
│   ├── admin.js            # 管理接口
│   └── profile.js          # 个人资料接口
├── socket/                 # WebSocket层
│   ├── index.js            # Socket.io封装（uni-app兼容）
│   └── roomSocket.js       # 房间实时事件订阅
├── store/                  # 状态管理（Vue 3 reactive）
│   ├── user.js             # 用户状态（Token/角色/筹码）
│   ├── room.js             # 房间状态（牌局/座位/底池）
│   └── theme.js            # 主题状态（当前游戏主题）
├── themes/                 # 五大游戏主题配置
│   ├── forbidden-city/     # 紫禁之巅（抢庄牛牛）
│   ├── jiangnan/           # 江南百景（抢庄三公）
│   ├── steampunk/          # 机械迷城（通比牛牛）
│   ├── noir/               # 雾都夜话（炸金花）
│   ├── wallstreet/         # 华尔街之狼（德州扑克）
│   └── themeConfig.js      # 主题统一导出
├── components/             # 通用组件
│   ├── poker/              # 扑克相关
│   │   └── PokerCard.vue   # 扑克牌（发牌动画/赢家高光）
│   ├── chips/              # 筹码相关
│   │   ├── ChipStack.vue   # 筹码堆（自动组合/堆叠动画）
│   │   └── PotDisplay.vue  # 底池（数字滚动/毛玻璃胶囊）
│   ├── seat/               # 座位相关
│   │   └── PlayerSeat.vue  # 玩家座位（呼吸光晕/庄家标识）
│   ├── ui/                 # UI组件
│   │   ├── ActionButtons.vue   # 操作按钮（按游戏类型动态显示）
│   │   ├── ChatBox.vue         # 聊天框（半透明悬浮/不遮挡牌面）
│   │   ├── OpenCardEffect.vue  # 开牌高潮动画（5种主题动画）
│   │   ├── ParticleSystem.vue  # 粒子系统（Canvas渲染）
│   │   └── ThemeBackground.vue # 主题背景（纹理/暗角遮罩）
│   └── settlement/         # 结算相关
│       ├── PyramidDistribution.vue # 倒金字塔鎏金动画
│       └── SettlementPanel.vue     # 结算面板（守恒等式展示）
├── pages/                  # 页面路由
│   ├── login/              # 登录页 ✅
│   ├── lobby/              # 大厅页 ✅
│   ├── room/               # 游戏房间
│   ├── workbench/          # 代理工作台 ✅
│   ├── customer-service/   # 客服工作台 ✅
│   ├── promotion/          # 总代推广中心 ✅
│   ├── admin/              # 管理后台 ✅
│   ├── profile/            # 个人中心
│   └── settings/           # 设置页面
├── utils/                  # 工具函数
│   ├── format.js           # 数字格式化（千分位/金额缩写）
│   ├── device.js           # 设备信息（ID/UA/屏幕）
│   ├── animation.js        # 动画缓动曲线+时间流控制
│   ├── sound.js            # 音效管理器（主题切换/震动反馈）
│   └── economy.js          # V3经济模型（抽水分配/层级追溯）
├── static/                 # 静态资源
│   ├── fonts/              # 定制字体
│   ├── sounds/             # 音效文件
│   ├── images/             # 主题素材
│   └── logo.png            # 品牌Logo
├── DESIGN.md               # 完整设计方案
├── openapi.json            # API文档（OpenAPI 3.0）
├── pages.json              # 页面路由配置
├── manifest.json           # 应用配置（横屏强制）
├── uni.scss                # 全局样式变量
├── App.vue                 # 根组件
└── main.js                 # 入口文件
```

---

## 🚀 快速开始

### 环境要求

- [HBuilderX](https://www.dcloud.io/hbuilderx.html) 3.0+
- Node.js 16+
- 微信小程序/支付宝小程序/APP 开发者账号

### 开发步骤

```bash
# 1. 克隆仓库
git clone https://github.com/AthenDrakomin-hub/v-poker-uni-app.git
cd v-poker-uni-app

# 2. 使用 HBuilderX 打开项目
# 文件 → 打开目录 → 选择 v-poker-uni-app

# 3. 配置 API 地址
# 修改 api/config.js 中的 BASE_URL
```

### 运行方式

| 方式 | 操作路径 |
|------|----------|
| 浏览器预览 | 运行 → 运行到浏览器 → Chrome |
| 真机调试 | 运行 → 运行到手机或模拟器 |
| 微信小程序 | 发行 → 小程序-微信 |
| APP打包 | 发行 → 原生App-云打包 |

---

## 🔧 技术栈

| 层级 | 技术选型 |
|------|----------|
| 框架 | Vue 3 (Options API) |
| 跨端 | uni-app |
| 状态管理 | Vue 3 reactive / ref |
| 样式 | SCSS + rpx 响应式 |
| 网络请求 | uni.request 封装（Token/设备ID自动注入） |
| 实时通信 | Socket.io + uni.connectSocket |
| 存储 | uni.setStorageSync / uni.getStorageSync |
| 动画 | CSS animation + Canvas 粒子 |

---

## 🔐 认证机制

### Token 认证（推荐 APP 端使用）

```javascript
// 登录成功后存储
uni.setStorageSync('vpoker_token', token)

// 请求头自动携带
Authorization: Bearer <token>
// 或
x-vpoker-token: <token>
```

### 设备绑定

```javascript
// 自动生成设备唯一ID
x-device-id: <device-uuid>
```

---

## 📊 开发进度

### ✅ 已完成

- [x] 项目骨架与目录结构
- [x] API 请求封装（Token/错误处理/设备ID）
- [x] API 接口文件（auth/rooms/agent/admin/profile）
- [x] WebSocket 封装（Socket.io 协议兼容）
- [x] 状态管理（user/room/theme）
- [x] 工具函数（format/device/animation/sound/economy）
- [x] 登录页（横屏 + 品牌展示 + 登录表单）
- [x] 大厅页（游戏选择 + 房间列表 + 用户信息）
- [x] 代理工作台、客服工作台、总代推广中心、管理后台
- [x] 全局样式变量（uni.scss）
- [x] 横屏强制配置（manifest + pages + App.vue）
- [x] 设计方案文档（DESIGN.md）

### ⏳ 待开发

- [ ] 游戏房间核心（横屏布局/座位系统/扑克牌组件）
- [ ] 筹码组件（筹码堆/飞入动画/底池数字滚动）
- [ ] 发牌动画（Ease-Out 缓动/微抛物线轨迹）
- [ ] 行动期呼吸光晕（90bpm 心跳频率）
- [ ] 五大游戏主题视觉系统
- [ ] 开牌高潮动画（5种主题专属）
- [ ] 鎏金金字塔结算动画
- [ ] 音效系统（主题切换/操作反馈/环境音）
- [ ] 性能优化与打包测试

---

## 📚 API 文档

完整 API 接口定义见 [openapi.json](./openapi.json)（OpenAPI 3.0 标准），可导入以下工具查看：

- [Swagger UI](https://editor.swagger.io/)
- [Postman](https://www.postman.com/)
- [Apifox](https://www.apifox.cn/)

---

## 🎨 设计规范

### 颜色系统

| 用途 | 色值 |
|------|------|
| 主色（金色） | `#FFD700` |
| 背景（深色） | `#0a0a0a` |
| 文字（浅色） | `#e8e8e8` |
| 毛玻璃背景 | `rgba(255,255,255,0.06)` + `blur(12px)` |

### 字体系统

| 层级 | 大小 | 字重 |
|------|------|------|
| 标题 | 40–72rpx | Bold |
| 正文 | 24–28rpx | Regular |
| 辅助 | 20–22rpx | Light |
| 数字 | 等宽字体 | — |

### 间距系统（rpx）

`xs: 8` · `sm: 16` · `md: 24` · `lg: 32` · `xl: 48`

### 圆角系统（rpx）

`sm: 8` · `md: 12` · `lg: 16` · `xl: 24` · `full: 9999`

---

## ⚠️ 注意事项

1. **横屏开发**：所有页面均为横屏布局，设计基准 `1920×1080`
2. **rpx 单位**：使用 uni-app 的 rpx 响应式单位（750rpx = 屏幕宽度）
3. **条件编译**：APP 端与 H5 端差异使用 `#ifdef APP-PLUS` / `#ifdef H5`
4. **性能优化**：动画优先使用 `transform` / `opacity`，避免触发重排
5. **内存管理**：离开房间页时务必销毁 Socket 连接和动画定时器

---

## 📄 许可证

仅供学习交流使用

---

**V-Poker 2.0** · 横屏沉浸式扑克竞技平台 · [设计方案 →](./DESIGN.md)
