# 竹林便签素材市场

「竹林」Obsidian 插件 · 画中卷·打字机「便签模式」的官方素材分发仓库。所有素材均为 **竹林用户专享** 内容。

## 版权与授权

- 维护者：**羽鳞君**
- 许可：**竹林用户专享 · 未经授权禁止使用（含个人使用）**

本仓库内所有素材（`materials/*.js`）仅限已安装并使用「竹林」插件（bamboo-immortals）的用户在插件内使用。
未经作者书面授权，任何人不得复制、转载、再分发、转售，亦不得在本插件之外以任何形式（含个人学习/自用）使用。

## 仓库结构

```
manifest.json        # 素材清单（插件拉取的市场数据源）
materials/           # 各素材的 .js 源文件（含版权文件头）
  ├─ 锦鲤贴纸.js      # type=sticker 样例
  └─ 暮山紫.js        # type=paper 样例
```

> 素材类型：`sticker`（可单独贴到已有便签上叠加的插画）、`paper`（便签皮肤，拖进画布新建卡片）、`font`（字体）、`template`（模板）。目前上架 2 个样例，其余调试完善后陆续上架。

---

## manifest.json 结构

```json
{
  "name": "竹林便签素材市场",
  "version": "1.0.0",
  "maintainer": "羽鳞君",
  "license": "竹林用户专享 · 未经授权禁止使用（含个人使用）",
  "materials": [
    {
      "id": "锦鲤贴纸",            // 唯一标识，需与文件名（不含 .js）、素材内 window.__bamboo_material_<id> 一致
      "name": "锦鲤贴纸",          // 展示名
      "type": "sticker",           // sticker | paper | font | template
      "author": "羽鳞君",          // 作者署名
      "license": "竹林用户专享 …",  // 版权声明（含「专享」时插件显示「竹林专享」徽章）
      "version": "1.0.0",          // 用于更新检测
      "url": "https://raw.githubusercontent.com/miaoziguan/bamboo-material-market/main/materials/锦鲤贴纸.js"
    }
  ]
}
```

## 素材声明规范（照主题动效同构）

每个素材是一个 `.js` 文件，导出 `window.__bamboo_material_<id> = material`：

```js
// 文件名: 我的素材.js  →  全局变量: __bamboo_material_我的素材

const material = {
  type: 'sticker',          // 必填：sticker | paper | font | template
  name: '我的素材',          // 必填：市场展示名

  // 必填：市场列表里「一张一张」展示的缩略图（内联 SVG/HTML，零外链）
  preview: '<svg …>…</svg>',

  // 仅 sticker 用：拖入画布/贴到卡片后，返回该素材的 DOM（插件包裹拖拽/旋转/缩放/层级）
  render() { return '<div class="bm-sticker">…</div>'; },

  // 仅 paper 用：返回注入到 .tw-card[data-paper="<id>"] 的 CSS（作用域隔离）
  css() { return '.tw-card[data-paper="我的素材"]{--rice-paper:#fff;…}'; },

  init(el) {},              // 可选：DOM 挂载后调用
  destroy() {},             // 可选：卸载时调用
};

window.__bamboo_material_我的素材 = material;
```

**与主题动效的关系**：命名规则（`__bamboo_material_<id>`）、分发（Git 仓库 + `manifest.json` + 按需拉取）、安全模型（静态审计 + 沙箱执行，复用插件 `ModuleManager._auditModuleCode/_evalModule`）三者完全同构。不同点：素材 loader 用 `window['__bamboo_material_' + id]` 按 id 原样取对象（支持中文 id），不作模块那种标识符清洗。

**纸纹取值键**（写 `css()` 时对齐现有纸纹，见 `notes.css`）：`--rice-paper`（纸底色）、`--ink-dark`（主墨）、`--ink-pale`（淡墨/标题）、`--tw-rule-rgb`（分隔线 RGB 三元组）。

## 新增素材

0. **paper 皮肤先复制模板**：`cp materials/_template.paper.js materials/你的皮肤名.js`。模板已把所有坑一次填对（含逐条注释说明为什么），比从零写或抄旧文件可靠得多。
   或者更省事——直接用生成器一条命令搞定（自动规范化设计稿、填模板、追加 manifest、跑闸门）：
   ```bash
   node scripts/new-paper.js 你的皮肤名 design.svg --top 35% --left 18.5% --right 18.5% --bottom 15%
   ```
1. 把素材 `.js` 放进 `materials/`，确保文件顶部含版权声明、并导出 `window.__bamboo_material_<id>`。
2. 在 `manifest.json` 的 `materials` 数组追加一条，填好 `id` / `name` / `type` / `author` / `license` / `version` / `url`（指向本仓库 raw 地址）。
3. 提交并推送到 `main` 分支，**CI 会自动跑「素材发布闸门」**，插件侧即可在「素材市场」中看到并一键下载。

> 设计稿嵌入 `css()` 的命令（二选一，推荐 base64，无转义陷阱）：
> ```bash
> node -e 'console.log("data:image/svg+xml;base64,"+require("fs").readFileSync("design.svg").toString("base64"))'
> node -e 'console.log("data:image/png;base64,"+require("fs").readFileSync("design.png").toString("base64"))'
> ```

## 素材发布闸门（发布前门禁）

`.github/workflows/check-materials.yml` 在每次 push / PR 时自动运行 `scripts/check-materials.js`，**失败即阻断合并**。本地可手动跑：

```bash
npm run check          # 闸门模式，有失败则退出码 1
npm run check:report   # 附带全量体检报告（体积 / 位图尺寸 / 内容占比 / viewBox）
```

脚本零依赖（仅用 Node 内置模块），CI 无需 `npm install`。如需豁免某条规则，登记到 `scripts/material-check-allow.json`（**当前为零豁免**——优先改素材本身）。

### 闸门拦截的事故类型

| 规则 | 拦截的事故 |
|---|---|
| `viewbox-fit` | viewBox 未贴合内容，缩略图留白（观宇宙曾只占到 46%×80%） |
| `no-bg-rect` | 误加铺满画布的不透明背景 `<rect>`（观宇宙曾整块白底） |
| `no-global-style` / `no-class` | 内嵌 `<style>` + 通用类名，多素材同屏时全局串色（腾云/驾雾事故根因） |
| `root-size` | 根 `<svg>` 被优化工具删掉 `width="100%" height="100%"`，缩略图/画布放大错位（2026-10 腾云预览图事故） |
| `bitmap-size` | 位图长边超 512px（观系列曾 800px，base64 1999KB） |
| `no-script` / `no-event-attr` / `no-javascript-url` | 内嵌脚本或事件属性（运行时安全风险） |
| `no-external` | 引用外部资源（破坏离线 / 隐私） |
| `size-budget` / `thumb-budget` | preview 或 manifest 缩略图超体积预算 |
| `css-missing` | type=paper 却缺少 `css()` |
| `css-bg-opaque` | 卡片 `background` 被写死不透明色，盖掉设计图（好好吃饭「便签没有背景」事故） |
| `css-card-rule` | 缺少 `.tw-card[data-paper="<id>"]` 卡片规则 |
| `css-ink-vars` | 卡片规则缺少 `--ink-dark` / `--tw-rule-rgb` 墨色取值键 |
| `css-head-rule` / `css-head-border` | 缺少 `.tw-card-head` 规则 / 未 `border:none`（主题默认 2px 下边框会变成卡片底部一条灰线） |
| `css-edge-noise` | 未 `display:none` 隐藏 `.tw-card-edge` / `.tw-card-noise` |
| `css-text-rule` / `css-text-font-size` / `css-text-overflow` | 缺文字区规则 / 写死 `font-size`（字号 ± 失效）/ 未开 `overflow:auto` |
| `css-scrollbar` / `css-scrollbar-width` | 未定义 `::-webkit-scrollbar`（吃默认滚动条）/ 误用 `scrollbar-width:none`（Chromium 会连带禁用 `::-webkit-scrollbar`） |
| `css-viewbox-aspect` | 背景图宽高比与 `aspect-ratio` 偏差 >1%，`background-size:100% 100%` 会拉伸变形 |
| `css-bitmap-small`（告警） | paper 背景位图长边 < 1000px，一放大就发虚 |
| `css-bitmap-in-svg`（告警） | 背景 SVG 被单张位图铺满，整张设计已被栅格化 |

> 内容「溢出」方向（`viewbox-overflow`）仅告警不阻断：素材常借助 `clip-path` 裁切，几何包围盒无法建模裁剪，硬判会误报。

## 素材制作红线（都是踩过的坑）

1. **位图必须用 `foreignObject` + `<img>` 包起来**，且 `<img>` 用 `width:100%;height:100%` 相对尺寸——这样换图不必改坐标。
2. **禁止内嵌 `<style>` 与 `class`**：设计工具导出的 `.cls-1/.cls-2` 在 HTML 里是全局作用域，多个素材同屏会互相覆盖导致串色。改用元素自身的 `fill`/`stroke` 属性（插件侧 `SvgIsolate` 也会兜底加作用域，但数据侧自包含更稳）。
3. **viewBox 必须贴合内容**：量出内容包围盒再设 viewBox，避免缩略图留白。
4. **位图分辨率 ≤512px、单 preview ≤100KB**（位图类素材的 manifest 缩略图应 ≤20KB）。
5. **不要铺满画布的不透明背景 `<rect>`**（除非那真是素材的一部分），**不要 `<script>` / 外链**。
6. **根 `<svg>` 必须自带尺寸**：写 `width="100%" height="100%"`（或 `style="width:100%;height:100%;display:block"`）。缩略图容器（96×96）与画布都靠它填满；一旦缺失，浏览器会退回固有尺寸（= viewBox 像素）导致**预览放大错位/被裁**。注意 svgo 的 `removeUnknownsAndDefaults` 会把它当根元素默认值删掉——压缩/优化素材后务必复查这一项。

### paper 皮肤专属红线（`css()` 层，2026-10 修「好好吃饭」时连踩 7 坑后固化）

> 旧闸门只检查 `preview` 与 manifest 缩略图，**从来没看过 `css()`**，而 paper 皮肤的风险全在这里。现在这些都已变成闸门规则，但理解原因比背规则重要。

7. **设计稿优先交付矢量 SVG**。位图长边建议 ≥1600px——低于此值用户一放大就发虚（好好吃饭曾压到 500px、梦珑香梨曾整张被栅格成 400px，双双被投诉）。矢量无限清晰且通常更小。若来源只有位图，**务必问作者要矢量原稿**，不要自己插值放大充数。
8. **卡片 `background` 必须 `transparent`**（或不写）。写死不透明色会把整张卡打成实色底、盖掉设计图——好好吃饭曾因 `background:#ffffff` 看起来「没有背景」。
9. **`.tw-card-head` 必须显式 `border:none`**。主题默认给它 `border-bottom:2px solid rgba(var(--tw-rule-rgb),.14)`，而 paper 规则特异性 (0,3,0) 高于基础 (0,1,0)，不显式清除就会在卡片底部多出一条灰线。
10. **`.tw-card-edge` / `.tw-card-noise` 必须 `display:none`**，否则带上主题默认的齿边与噪点。
11. **`.tw-card-text` 禁止写 `font-size`**。主题字号链路是 `A↑A↓ → --tw-text-zoom → --tw-fs-base → .tw-card-text{font-size:var(--tw-fs-base)}`；paper 规则特异性更高，一写死就掐断链路，字号按钮全程无反应。
12. **滚动条用「发丝级悬停」四联**（3px 窄轨 + 透明轨道 + 默认隐形滑块 + 悬停才显 `rgba(35,24,21,0.12)`）。**不要用 `scrollbar-width:none`**——新版 Chromium 会彻底禁用滚动条，并让 `::-webkit-scrollbar` 规则全部失效。
13. **背景图宽高比必须与 `aspect-ratio` 一致**。`background-size:100% 100%` 是强行拉伸，差超过 1% 就能看出变形。
14. **文字编辑区用百分比量准**。`top/left/right/bottom` 定义用户可输入文字的范围，超出手绘便签的写字区会压到标题或边框。

---

## 开发工具

两个零依赖 Node 脚本（`scripts/` 下），CI 无需安装任何东西。

### `scripts/new-paper.js` — paper 皮肤生成器

一条命令从设计稿生成完全合规的素材：

```bash
node scripts/new-paper.js <名字> <设计稿.svg|png> [选项]
# 选项：--top/--left/--right/--bottom（文字区百分比）
#       --ink-dark/--ink-pale/--rule（墨色）
#       --series/--desc/--author（manifest 字段）
#       --force 覆盖  --no-gate 跳过闸门
```

自动做四件事：规范化设计稿（`class=`→内联 `fill`、补根尺寸、去 XML 声明）、按模板填值（`aspect-ratio` 从 viewBox 自动推算）、追加 manifest 条目、跑闸门。模板即 `materials/_template.paper.js`——**改模板即改生成器产出**，不另存一份 CSS 真值。

### `scripts/calibrate-text-area.js` — 文字区可视化标定

解决「4 个百分比靠手算」：生成一个自包含 HTML 预览页，设计图上叠一个可拖拽/可缩放的框，实时输出 `top/left/right/bottom` 和一键复制的 CSS。

```bash
node scripts/calibrate-text-area.js <设计稿.svg> [out.html]   # 从设计稿标定
node scripts/calibrate-text-area.js --material 好好吃饭        # 从已上架素材标定
```

用浏览器打开生成的 HTML：拖红框移动、拖 8 个圆点缩放、方向键微调（先点一下红框）、数值按 0.5% 对齐，右侧实时给出可粘贴的 `.tw-card-text` 规则。
