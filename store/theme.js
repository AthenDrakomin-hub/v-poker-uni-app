/**
 * V-Poker 主题状态管理
 * 五大游戏主题切换
 */
import { reactive, ref } from 'vue'

// 主题定义
export const THEMES = {
  forbidden_city: {
    id: 'forbidden_city',
    name: '紫禁之巅·斗兽场',
    gameType: 'niuniu',
    colors: {
      bg: '#1A1A1A',
      bgGradient: 'radial-gradient(ellipse at center, #2A2A2A 0%, #0A0A0A 100%)',
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#8B0000',
      text: '#E8E8E8',
      textMuted: 'rgba(255,255,255,0.5)',
      border: 'rgba(255,215,0,0.3)',
      cardBack: '#1A1A1A',
      cardBackPattern: '蛛网裂纹',
    },
    effects: {
      vignette: true,
      particles: '焚香',
      openCardEffect: '金光炸裂',
      sound: '战鼓+编钟',
    },
  },
  jiangnan: {
    id: 'jiangnan',
    name: '江南百景·青玉案',
    gameType: 'sangong',
    colors: {
      bg: '#E8F4F8',
      bgGradient: 'radial-gradient(ellipse at center, #F0F8FA 0%, #D0E8F0 100%)',
      primary: '#4A90A4',
      secondary: '#2C5F6D',
      accent: '#8B7355',
      text: '#2C3E50',
      textMuted: 'rgba(44,62,80,0.5)',
      border: 'rgba(74,144,164,0.3)',
      cardBack: '#4A90A4',
      cardBackPattern: '水波纹',
    },
    effects: {
      vignette: false,
      particles: '落叶',
      openCardEffect: '水墨晕染',
      sound: '古琴+水滴',
    },
  },
  steampunk: {
    id: 'steampunk',
    name: '机械迷城·流水线',
    gameType: 'tbnn',
    colors: {
      bg: '#2D2D2D',
      bgGradient: 'radial-gradient(ellipse at center, #3D3D3D 0%, #1D1D1D 100%)',
      primary: '#CD7F32',
      secondary: '#8B4513',
      accent: '#B8860B',
      text: '#E8DCC8',
      textMuted: 'rgba(232,220,200,0.5)',
      border: 'rgba(205,127,50,0.3)',
      cardBack: '#8B4513',
      cardBackPattern: '齿轮纹理',
    },
    effects: {
      vignette: true,
      particles: '蒸汽',
      openCardEffect: '机械臂冲压',
      sound: '金属冲压+蒸汽',
    },
  },
  noir: {
    id: 'noir',
    name: '雾都夜话·黑胶密房',
    gameType: 'jinhua',
    colors: {
      bg: '#0A0A0A',
      bgGradient: 'radial-gradient(ellipse at center, #1A1A1A 0%, #000000 100%)',
      primary: '#FFD700',
      secondary: '#8B0000',
      accent: '#4A4A4A',
      text: '#E8E8E8',
      textMuted: 'rgba(255,255,255,0.4)',
      border: 'rgba(255,215,0,0.2)',
      cardBack: '#0A0A0A',
      cardBackPattern: '黑胶纹路',
    },
    effects: {
      vignette: true,
      particles: '烟雾',
      openCardEffect: '聚光灯收窄',
      sound: '黑胶+爵士贝斯',
    },
  },
  wallstreet: {
    id: 'wallstreet',
    name: '华尔街之狼·信息交易所',
    gameType: 'texas',
    colors: {
      bg: '#0F1923',
      bgGradient: 'radial-gradient(ellipse at center, #1A2A3A 0%, #0A1018 100%)',
      primary: '#00D4FF',
      secondary: '#FF6B35',
      accent: '#4ADE80',
      text: '#E8E8E8',
      textMuted: 'rgba(255,255,255,0.5)',
      border: 'rgba(0,212,255,0.3)',
      cardBack: '#0F1923',
      cardBackPattern: '数据网格',
    },
    effects: {
      vignette: false,
      particles: '数据雨',
      openCardEffect: '网格线亮起',
      sound: '交易提示+电子音',
    },
  },
}

// 主题状态
export const themeState = reactive({
  currentTheme: 'forbidden_city',
  themeData: THEMES.forbidden_city,
})

// 当前主题
export const currentTheme = ref(THEMES.forbidden_city)

/**
 * 根据游戏类型获取主题
 */
export function getThemeByGameType(gameType) {
  const themeMap = {
    niuniu: 'forbidden_city',
    sangong: 'jiangnan',
    tbnn: 'steampunk',
    jinhua: 'noir',
    texas: 'wallstreet',
  }
  const themeId = themeMap[gameType] || 'forbidden_city'
  return THEMES[themeId]
}

/**
 * 设置主题
 */
export function setTheme(themeId) {
  if (THEMES[themeId]) {
    themeState.currentTheme = themeId
    themeState.themeData = THEMES[themeId]
    currentTheme.value = THEMES[themeId]
  }
}

/**
 * 根据游戏类型设置主题
 */
export function setThemeByGameType(gameType) {
  const theme = getThemeByGameType(gameType)
  setTheme(theme.id)
}

/**
 * 获取当前主题颜色
 */
export function getThemeColors() {
  return currentTheme.value.colors
}

/**
 * 获取当前主题效果
 */
export function getThemeEffects() {
  return currentTheme.value.effects
}

export default {
  THEMES,
  themeState,
  currentTheme,
  getThemeByGameType,
  setTheme,
  setThemeByGameType,
  getThemeColors,
  getThemeEffects,
}
