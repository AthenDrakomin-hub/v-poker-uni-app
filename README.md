# V-Poker UNI-APP 横屏前端

> V-Poker 2.0 扑克竞技平台 · 横屏沉浸式体验 · Vue 3 + uni-app

## 📖 设计方案

完整设计方案请参考 [DESIGN.md](./DESIGN.md)

**四大意识流**：
1. 横屏下的"重力场"视觉美学
2. 牌局情绪的"蒙太奇"时间流
3. V3抽水分配的"鎏金仪式"可视化
4. 多角色工作台的"人格分裂"设计哲学

**五座斗兽场**（游戏主题）：
- 《紫禁之巅·斗兽场》- 抢庄牛牛（黑金帝王气场）
- 《江南百景·青玉案》- 抢庄三公（月白天青水墨意境）
- 《机械迷城·流水线》- 通比牛牛（蒸汽朋克工业风）
- 《雾都夜话·黑胶密房》- 炸金花（聚光灯暗影心理战）
- 《华尔街之狼·信息交易所》- 德州扑克（半透明玻璃数据风）

## 🏗️ 项目结构

```
v-poker-uni-app/
├── api/                    # API层
│   ├── config.js           # API配置
│   ├── request.js          # 请求封装（Token/错误处理/设备ID）
│   ├── auth.js             # 认证接口
│   ├── rooms.js            # 房间接口
│   ├── agent.js            # 代理接口
│   ├── admin.js            # 管理接口
│   └── profile.js          # 个人资料接口
├── socket/                 # WebSocket层
│   ├── index.js            # Socket.io封装（uni-app兼容）
│   └── roomSocket.js       # 房间实时事件
├── store/                  # 状态管理（Vue3 reactive）
│   ├── user.js             # 用户状态（Token/角色/筹码）
│   ├── room.js             # 房间状态（牌局/座位/底池）
│   └── theme.js            # 主题状态（五大游戏主题）
├── themes/                 # 五大游戏主题配置
│   └── themeConfig.js      # 主题配置（颜色/粒子/开牌动画/音效）
├── components/             # 通用组件
│   ├── poker/              # 扑克相关
│   │   └── PokerCard.vue   # 扑克牌组件（发牌动画/赢家高光）
│   ├── chips/              # 筹码相关
│   │   ├── ChipStack.vue   # 筹码堆组件（自动组合/堆叠动画）
│   │   └── PotDisplay.vue  # 底池组件（数字滚动/毛玻璃胶囊）
│   ├── seat/               # 座位相关
│   │   └── PlayerSeat.vue  # 玩家座位（呼吸光晕/庄家标识）
│   ├── ui/                 # UI组件
│   │   ├── ActionButtons.vue   # 操作按钮（按游戏类型动态显示）
│   │   ├── ChatBox.vue         # 聊天框（半透明悬浮/不遮挡牌面）
│   │   ├── ParticleSystem.vue  # 粒子系统（5种粒子类型/Canvas）
│   │   ├── OpenCardEffect.vue  # 开牌高潮动画（5种动画/震屏）
│   │   └── ThemeBackground.vue # 主题背景（4种纹理/暗角遮罩）
│   └── settlement/         # 结算相关
│       ├── PyramidDistribution.vue # 倒金字塔鎏金动画（V3抽水分配）
│       └── SettlementPanel.vue     # 结算面板（玩家结果+金字塔+守恒等式）
├── pages/                  # 页面
│   ├── login/              # 登录页 ✅
│   ├── lobby/              # 大厅页 ✅
│   ├── room/               # 游戏房间 ✅
│   ├── workbench/          # 代理工作台 ✅（琥珀金·毛玻璃）
│   ├── customer-service/   # 客服工作台 ✅（静默蓝灰·时间线）
│   ├── promotion/          # 总代推广中心 ✅（暗夜紫·帝国俯瞰）
│   ├── admin/              # 管理后台 ✅（冷峻铁灰·全局控制）
│   ├── profile/            # 个人中心 ✅
│   └── settings/           # 设置页面 ✅
├── utils/                  # 工具函数
│   ├── format.js           # 数字格式化
│   ├── device.js           # 设备信息
│   ├── animation.js        # 动画缓动曲线+时间流控制
│   ├── sound.js            # 音效管理器（主题切换/震动反馈）
│   └── economy.js          # V3经济模型（抽水分配/层级追溯/守恒验证）
├── static/                 # 静态资源
│   ├── fonts/              # 定制字体
│   ├── sounds/             # 音效
│   └── images/             # 主题素材
├── DESIGN.md               # 设计方案
├── openapi.json            # API文档（OpenAPI 3.0）
├── pages.json              # 页面路由配置
├── manifest.json           # 应用配置（横屏）
├── uni.scss                # 全局样式变量
├── App.vue                 # 根组件
└── main.js                 # 入口文件
```

## 🚀 快速开始

### 环境要求
- HBuilderX 3.0+
- Vue 3
- uni-app 编译器

### 开发步骤

1. **使用HBuilderX打开项目**
   ```
   文件 → 打开目录 → 选择 v-poker-uni-app
   ```

2. **配置API地址**
   修改 `api/config.js` 中的 `BASE_URL`：
   ```javascript
   // 开发环境
   const BASE_URL = 'http://localhost:3001'
   // 生产环境
   const BASE_URL = 'https://api.yourdomain.com'
   ```

3. **运行到浏览器**
   ```
   运行 → 运行到浏览器 → Chrome
   ```

4. **运行到手机**
   ```
   运行 → 运行到手机或模拟器 → 选择设备
   ```

5. **打包APP**
   ```
   发行 → 原生App-云打包 → 选择Android/iOS
   ```

## 📱 横屏配置

项目已配置强制横屏：
- `manifest.json` → `app-plus.screenOrientation: "landscape"`
- `pages.json` → 所有页面 `pageOrientation: "landscape"`
- `App.vue` → 运行时 `plus.screen.lockOrientation("landscape-primary")`

## 🔐 认证机制

支持双模式认证：
1. **Token认证**（APP端推荐）
   - 登录后获取Token，保存到本地存储
   - 请求头携带 `Authorization: Bearer <token>` 或 `x-vpoker-token: <token>`

2. **设备绑定**
   - 自动生成设备唯一ID
   - 请求头携带 `x-device-id`

## 🎮 游戏类型

| 游戏ID | 名称 | 主题 | 状态 |
|--------|------|------|------|
| niuniu | 抢庄牛牛 | 紫禁之巅·斗兽场 | 待实现 |
| sangong | 抢庄三公 | 江南百景·青玉案 | 待实现 |
| tbnn | 通比牛牛 | 机械迷城·流水线 | 待实现 |
| jinhua | 炸金花 | 雾都夜话·黑胶密房 | 待实现 |
| texas | 德州扑克 | 华尔街之狼·信息交易所 | 待实现 |

## 📊 开发进度

### 第一阶段 ✅ 已完成
- [x] 项目骨架（目录结构）
- [x] API请求封装（Token/错误处理/设备ID）
- [x] API接口文件（auth/rooms/agent/admin/profile）
- [x] WebSocket封装（Socket.io兼容）
- [x] 状态管理（user/room/theme）
- [x] 工具函数（format/device/animation）
- [x] 登录页（横屏+品牌展示+登录表单）
- [x] 大厅页（游戏选择+房间列表+用户信息）
- [x] 其他页面占位
- [x] 全局样式变量
- [x] 横屏强制配置
- [x] 设计方案文档

### 第二阶段 ⏳ 待开始
- [ ] 游戏房间核心（横屏布局/座位系统/扑克牌组件）
- [ ] 筹码组件（筹码堆/飞入动画/底池）
- [ ] 发牌动画（Ease-Out/微抛物线）
- [ ] 行动期呼吸光晕（90bpm）
- [ ] 摊牌期子弹时间

### 第三阶段 ⏳ 待开始
- [ ] 五大游戏主题视觉系统
- [ ] 主题粒子效果
- [ ] 开牌高潮动画
- [ ] 主题音效

### 第四阶段 ⏳ 待开始
- [ ] 鎏金金字塔动画
- [ ] 守恒等式展示
- [ ] 结算面板

### 第五阶段 ⏳ 待开始
- [ ] 代理工作台（琥珀金·毛玻璃）
- [ ] 客服工作台（静默蓝灰·时间线）
- [ ] 总代推广中心（暗夜紫·力导向图）
- [ ] 管理后台（冷峻铁灰·数据仪表盘）

### 第六阶段 ⏳ 待开始
- [ ] 个人中心
- [ ] 设置页面
- [ ] 打包测试
- [ ] 性能优化

## 📚 API文档

完整API文档请参考 [openapi.json](./openapi.json)（OpenAPI 3.0标准）

可导入Swagger UI、Postman、Apifox等工具查看。

## 🎨 设计规范

### 颜色系统
- 主色：金色 #FFD700
- 背景：深色 #0a0a0a
- 文字：浅灰 #e8e8e8
- 毛玻璃：rgba(255,255,255,0.06) + blur(12px)

### 字体系统
- 标题：粗体 40-72rpx
- 正文：常规 24-28rpx
- 辅助：小号 20-22rpx
- 数字：等宽字体

### 间距系统
- xs: 8rpx
- sm: 16rpx
- md: 24rpx
- lg: 32rpx
- xl: 48rpx

### 圆角系统
- sm: 8rpx
- md: 12rpx
- lg: 16rpx
- xl: 24rpx
- full: 9999rpx

## 🔧 技术栈

- **框架**: Vue 3 (Options API)
- **跨端**: uni-app
- **状态管理**: Vue 3 reactive/ref
- **样式**: SCSS
- **网络请求**: uni.request 封装
- **WebSocket**: uni.connectSocket (Socket.io协议)
- **存储**: uni.setStorageSync

## 📝 注意事项

1. **横屏开发**：所有页面均为横屏布局，设计基准1920×1080
2. **rpx单位**：使用uni-app的rpx响应式单位
3. **条件编译**：APP端和H5端差异使用 `#ifdef APP-PLUS` / `#ifdef H5`
4. **性能优化**：动画使用transform/opacity，避免重排
5. **内存管理**：离开房间页时销毁Socket连接和动画定时器

## 📄 许可证

仅供学习交流使用

---

**V-Poker 2.0 · 横屏沉浸式扑克竞技平台**
