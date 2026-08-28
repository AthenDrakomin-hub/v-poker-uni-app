/**
 * 将 static/icons/ 下的 SVG 图标转换为 base64 data URL
 * 生成 utils/icons-base64.js，供 VIcon 组件内联使用
 * 避免 App 端远程加载 SVG 不稳定的问题
 */
const fs = require('fs')
const path = require('path')

const ICONS_DIR = path.resolve(__dirname, '..', 'static', 'icons')
const OUTPUT_FILE = path.resolve(__dirname, '..', 'utils', 'icons-base64.js')

function svgToBase64(svgContent) {
  // 移除 XML 声明和注释，压缩空白
  let compressed = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim()
  const base64 = Buffer.from(compressed, 'utf-8').toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

function main() {
  const svgFiles = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'))
  console.log(`找到 ${svgFiles.length} 个 SVG 图标\n`)

  const entries = []
  for (const file of svgFiles) {
    const name = path.basename(file, '.svg')
    const content = fs.readFileSync(path.join(ICONS_DIR, file), 'utf-8')
    const dataUrl = svgToBase64(content)
    const sizeKB = (Buffer.from(dataUrl).length / 1024).toFixed(1)
    console.log(`  ${name}.svg → ${sizeKB}KB`)
    entries.push(`  '${name}': '${dataUrl}'`)
  }

  const output = `/**
 * V-Poker 图标 base64 内联库
 * 由 scripts/gen-icons-base64.js 自动生成
 * 请勿手动修改，新增图标后重新运行脚本生成
 */
export const ICONS_BASE64 = {
${entries.join(',\n')}
}

export default { ICONS_BASE64 }
`

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8')
  console.log(`\n✅ 已生成 ${OUTPUT_FILE}`)
  console.log(`   共 ${entries.length} 个图标，文件大小 ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)}KB`)
}

main()
