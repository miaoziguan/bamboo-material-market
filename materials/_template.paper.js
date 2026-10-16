/**
 * 竹林便签素材市场 · paper（便签皮肤）模板
 * ============================================================================
 * 这不是上架素材（文件名以 _ 开头，manifest 不登记，闸门不扫描）。
 * 新皮肤从它复制，把 TODO 填掉即可——下面每一条规则都对应一次真实事故。
 *
 * 【使用步骤】
 *   1. cp materials/_template.paper.js materials/你的皮肤名.js
 *   2. 全文替换两处命名：
 *        __bamboo_material_你的皮肤名   （全局变量，需与文件名一致）
 *        data-paper="你的皮肤名"         （css 作用域锚点）
 *   3. 用设计稿替换 preview（市场缩略图）与 css() 里的背景图
 *   4. 改 aspect-ratio（设计稿宽高比）与 .tw-card-text 的 4 个百分比（文字编辑区）
 *   5. node scripts/check-materials.js          ← 必须 exit 0 才能提交
 *
 * 【设计稿嵌入 css() 的方法】（二选一，推荐 base64，无转义陷阱）
 *   node -e 'console.log("data:image/svg+xml;base64,"+require("fs").readFileSync("design.svg").toString("base64"))'
 *   node -e 'console.log("data:image/png;base64,"+require("fs").readFileSync("design.png").toString("base64"))'
 *   把输出整行贴到下面 ::after 的 background-image 里。
 *
 * 【便签皮肤制作红线（每条都是踩过的坑）】
 *   1. 设计稿优先交付【矢量 SVG】。位图长边建议 ≥1600px——低于此值用户一放大就发虚
 *      （好好吃饭曾压到 500px、梦珑香梨曾整张被栅格成 400px，双双被投诉）。
 *      矢量 SVG 无限清晰，且文件通常更小。
 *   2. 卡片 background 必须 transparent（或不写）。写死不透明色会把整张卡打成实色底，
 *      盖掉设计图——好好吃饭曾因 background:#ffffff 看起来「没有背景」。
 *   3. .tw-card-head 必须显式 border:none。主题默认给它一条
 *      border-bottom:2px solid rgba(var(--tw-rule-rgb),.14)，而 paper 规则特异性更高，
 *      不显式清除就会在卡片底部多出一条灰线（好好吃饭事故）。
 *   4. .tw-card-edge / .tw-card-noise 必须 display:none，否则带上主题默认的齿边与噪点。
 *   5. .tw-card-text 【禁止写 font-size】。主题的字号链路是
 *        A↑A↓ 按钮 → --tw-text-zoom → --tw-fs-base → .tw-card-text{font-size:var(--tw-fs-base)}
 *      paper 规则特异性 (0,3,0) 高于基础规则 (0,1,0)，一旦写死就掐断链路，
 *      字号按钮全程无反应（好好吃饭事故）。要调大小就改 --tw-type-fs 或接受主题默认。
 *   6. 滚动条用下面的「发丝级悬停」四联，不要用 scrollbar-width:none——
 *      新版 Chromium 中它会彻底禁用滚动条，并让 ::-webkit-scrollbar 规则全部失效。
 *   7. 背景图宽高比必须与 aspect-ratio 一致。background-size:100% 100% 是强行拉伸，
 *      差超过 1% 就会看出变形（闸门 css-viewbox-aspect 会拦）。
 *   8. preview（市场缩略图）另有独立要求：根 <svg> 必须带 width="100%" height="100%"、
 *      禁止内嵌 <style> 与 class=、禁止铺满画布的不透明 <rect>、viewBox 贴合内容。
 *      详见 README「素材制作红线」。
 * ============================================================================
 */

// 文件名: 你的皮肤名.js  →  全局变量: __bamboo_material_你的皮肤名
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利

const material = {
  type: 'paper',                 // 必填：paper = 便签皮肤（拖进画布新建卡片）
  name: '你的皮肤名',            // TODO: 市场展示名，与文件名一致

  // 市场列表缩略图（内联 SVG，零外链）。
  // 注意：这里是【缩略图】，不是卡片背景——卡片背景在 css() 的 ::after 里。
  // 根 <svg> 必须自带 width="100%" height="100%"；禁止 <style> / class= / 铺满画布的实色 rect。
  preview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="100%" height="100%">
  <rect x="4" y="4" width="392" height="552" fill="none" stroke="#1a1a1a" stroke-width="4"/>
  <text x="200" y="280" text-anchor="middle" font-size="36" fill="#1a1a1a">TODO</text>
  <text x="200" y="330" text-anchor="middle" font-size="22" fill="#8c857c">替换为设计稿</text>
</svg>`,

  // 注入到 .tw-card[data-paper="你的皮肤名"] 的 CSS（作用域隔离，不会污染其他素材）
  css() {
    return `
      .tw-card[data-paper="你的皮肤名"]{
        background:transparent;                 /* 必须透明：背景交给设计图，别盖掉它 */
        box-shadow:none;
        border:none;
        aspect-ratio: 400 / 560;                /* TODO: 设计稿宽高比，须与背景图一致 */
        --rice-paper:transparent;               /* 纸底色；若设计本身是不透明纸才改 */
        --ink-dark:#1a1a1a;                     /* 主墨色（正文）*/
        --ink-pale:#8c857c;                     /* 淡墨（标题等弱信息）*/
        --tw-rule-rgb:140,133,124;              /* 分隔线 RGB 三元组，与 --ink-pale 同色 */
        --edge-distort:0;
        --noise:0;
      }
      /* 齿边与噪点元素：不隐藏会带上主题默认装饰 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-edge,
      .tw-card[data-paper="你的皮肤名"] .tw-card-noise{display:none;}
      /* 卡片主体：display:block 覆盖主题的 flex 布局，color 供正文继承 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-main{
        background:transparent; color:#1a1a1a; position:relative; height:100%; padding:0; display:block;
      }
      /* 主题自带的标题栏：本设计自带标题，隐藏掉 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-title{ visibility:hidden; }
      /* 交互层铺满卡片；border:none 是关键——清掉主题默认的 2px 下边框，否则卡片底部多一条灰线 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      /* ── 文字编辑区：4 个百分比定义「用户能输入文字」的范围 ──
         top/left/right/bottom 都是相对于卡片。建议先用设计稿量出可写字块的位置。
         这里【不要写 font-size】——字号由主题 var(--tw-fs-base) 联动 A↑A↓ 按钮，
         paper 规则特异性更高，写死即使字号调节失效。 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-text{
        position:absolute; top:35%; left:18.5%; right:18.5%; bottom:15%;
        color:#1a1a1a; text-align:center; z-index:2; overflow:auto;
      }
      /* ── 发丝级悬停滚动条 ──
         默认完全隐形（轨道与滑块皆透明），鼠标悬停卡片时才浮现 3px 淡墨滑块。
         既有「还有更多内容」的提示，又不破坏设计。勿改 scrollbar-width:none。 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="你的皮肤名"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="你的皮肤名"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="你的皮肤名"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      /* ── 设计图（卡片背景）──
         TODO: 用上面的命令生成 data-URI 整行替换。
         优先矢量 SVG（无限清晰）；若只有位图，长边务必 ≥1600px。
         background-size:100% 100% 会拉伸，故背景图宽高比必须与 aspect-ratio 一致。 */
      .tw-card[data-paper="你的皮肤名"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:url("TODO:粘贴 data:image/svg+xml;base64,... 或 data:image/png;base64,...");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  // paper 用：返回贴纸 DOM（本模板用 preview 作占位，按需改为 render() 自有结构）
  render() {
    return `<div class="bm-sticker-你的皮肤名"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_你的皮肤名 = material;
