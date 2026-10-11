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

1. 把素材 `.js` 放进 `materials/`，确保文件顶部含版权声明、并导出 `window.__bamboo_material_<id>`。
2. 在 `manifest.json` 的 `materials` 数组追加一条，填好 `id` / `name` / `type` / `author` / `license` / `version` / `url`（指向本仓库 raw 地址）。
3. 提交并推送到 `main` 分支，**CI 会自动跑「素材发布闸门」**，插件侧即可在「素材市场」中看到并一键下载。

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

> 内容「溢出」方向（`viewbox-overflow`）仅告警不阻断：素材常借助 `clip-path` 裁切，几何包围盒无法建模裁剪，硬判会误报。

## 素材制作红线（都是踩过的坑）

1. **位图必须用 `foreignObject` + `<img>` 包起来**，且 `<img>` 用 `width:100%;height:100%` 相对尺寸——这样换图不必改坐标。
2. **禁止内嵌 `<style>` 与 `class`**：设计工具导出的 `.cls-1/.cls-2` 在 HTML 里是全局作用域，多个素材同屏会互相覆盖导致串色。改用元素自身的 `fill`/`stroke` 属性（插件侧 `SvgIsolate` 也会兜底加作用域，但数据侧自包含更稳）。
3. **viewBox 必须贴合内容**：量出内容包围盒再设 viewBox，避免缩略图留白。
4. **位图分辨率 ≤512px、单 preview ≤100KB**（位图类素材的 manifest 缩略图应 ≤20KB）。
5. **不要铺满画布的不透明背景 `<rect>`**（除非那真是素材的一部分），**不要 `<script>` / 外链**。
6. **根 `<svg>` 必须自带尺寸**：写 `width="100%" height="100%"`（或 `style="width:100%;height:100%;display:block"`）。缩略图容器（96×96）与画布都靠它填满；一旦缺失，浏览器会退回固有尺寸（= viewBox 像素）导致**预览放大错位/被裁**。注意 svgo 的 `removeUnknownsAndDefaults` 会把它当根元素默认值删掉——压缩/优化素材后务必复查这一项。
