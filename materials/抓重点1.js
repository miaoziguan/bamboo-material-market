/**
 * 竹林便签素材市场 · paper（便签皮肤）模板
 * ============================================================================
 * 这不是上架素材（文件名以 _ 开头，manifest 不登记，闸门不扫描）。
 * 新皮肤从它复制，把 TODO 填掉即可——下面每一条规则都对应一次真实事故。
 *
 * 【使用步骤】
 *   1. cp materials/_template.paper.js materials/抓重点1.js
 *   2. 全文替换两处命名：
 *        __bamboo_material_抓重点1   （全局变量，需与文件名一致）
 *        data-paper="抓重点1"         （css 作用域锚点）
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

// 文件名: 抓重点1.js  →  全局变量: __bamboo_material_抓重点1
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利

const material = {
  type: 'paper',                 // 必填：paper = 便签皮肤（拖进画布新建卡片）
  name: '抓重点1',            // TODO: 市场展示名，与文件名一致

  // 市场列表缩略图（内联 SVG，零外链）。
  // 注意：这里是【缩略图】，不是卡片背景——卡片背景在 css() 的 ::after 里。
  // 根 <svg> 必须自带 width="100%" height="100%"；禁止 <style> / class= / 铺满画布的实色 rect。
  preview: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 277 277.5">
  <defs>
    <filter id="p91466-filter-1" filterUnits="userSpaceOnUse" x="34" y="34.5" width="245" height="245" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter>
    <filter id="p91466-filter-2" filterUnits="userSpaceOnUse" x="-2" y="-2" width="107" height="107" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter>
  </defs>
  <g id="p91466-Asset_108" data-name="Asset 108">
    <g>
      <g>
        <path d="M63 43.5 L250 43.5 C261.043 43.5 270 52.457 270 63.5 L270 250.5 C270 261.543 261.043 270.5 250 270.5 L63 270.5 C51.957 270.5 43 261.543 43 250.5 L43 63.5 C43 52.457 51.957 43.5 63 43.5 Z" fill="#ffffff"/>
        <path d="M20.034 20.034 C37.411 2.657 65.589 2.657 82.966 20.034 C100.343 37.411 100.343 65.589 82.966 82.966 C65.589 100.343 37.411 100.343 20.034 82.966 C2.657 65.589 2.657 37.411 20.034 20.034 Z" fill="#ffffff"/>
      </g>
      <g>
        <g filter="url(#p91466-filter-1)">
          <path d="M63 51.5 L250 51.5 C256.627 51.5 262 56.873 262 63.5 L262 250.5 C262 257.127 256.627 262.5 250 262.5 L63 262.5 C56.373 262.5 51 257.127 51 250.5 L51 63.5 C51 56.873 56.373 51.5 63 51.5 Z" fill="#ffb5d5"/>
        </g>
        <g filter="url(#p91466-filter-2)">
          <circle cx="51.5" cy="51.5" r="36.5" fill="#ffb5d5"/>
        </g>
      </g>
      <circle cx="51.5" cy="51.5" r="23.092" fill="#ffffff"/>
      <text transform="matrix(2.5 0 0 2.5 43 60)" x="0" y="0" xml:space="preserve" font-family="MiaoZi-YunYingTi, sans-serif" font-size="12px" fill="#ffb5d5"><tspan x="0" y="0">1</tspan></text>
    </g>
  </g>
</svg>`,

  // 注入到 .tw-card[data-paper="抓重点1"] 的 CSS（作用域隔离，不会污染其他素材）
  css() {
    return `
      .tw-card[data-paper="抓重点1"]{
        background:transparent;                 /* 必须透明：背景交给设计图，别盖掉它 */
        box-shadow:none;
        border:none;
        aspect-ratio: 277 / 277.5;                /* TODO: 设计稿宽高比，须与背景图一致 */
        --rice-paper:transparent;               /* 纸底色；若设计本身是不透明纸才改 */
        --ink-dark:#1a1a1a;                     /* 主墨色（正文）*/
        --ink-pale:#8c857c;                     /* 淡墨（标题等弱信息）*/
        --tw-rule-rgb:140,133,124;              /* 分隔线 RGB 三元组，与 --ink-pale 同色 */
        --edge-distort:0;
        --noise:0;
      }
      /* 齿边与噪点元素：不隐藏会带上主题默认装饰 */
      .tw-card[data-paper="抓重点1"] .tw-card-edge,
      .tw-card[data-paper="抓重点1"] .tw-card-noise{display:none;}
      /* 卡片主体：display:block 覆盖主题的 flex 布局，color 供正文继承 */
      .tw-card[data-paper="抓重点1"] .tw-card-main{
        background:transparent; color:#1a1a1a; position:relative; height:100%; padding:0; display:block;
      }
      /* 主题自带的标题栏：本设计自带标题，隐藏掉 */
      .tw-card[data-paper="抓重点1"] .tw-card-title{ visibility:hidden; }
      /* 交互层铺满卡片；border:none 是关键——清掉主题默认的 2px 下边框，否则卡片底部多一条灰线 */
      .tw-card[data-paper="抓重点1"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      /* ── 文字编辑区：4 个百分比定义「用户能输入文字」的范围 ──
         top/left/right/bottom 都是相对于卡片。建议先用设计稿量出可写字块的位置。
         这里【不要写 font-size】——字号由主题 var(--tw-fs-base) 联动 A↑A↓ 按钮，
         paper 规则特异性更高，写死即使字号调节失效。 */
      .tw-card[data-paper="抓重点1"] .tw-card-text{
        position:absolute; top:30%; left:19%; right:9%; bottom:9%;
        color:#1a1a1a; z-index:2; overflow:auto;
        /* 不要写 text-align：全局 .tw-card-text 已设 justify（两端对齐），
           皮肤规则特异性更高，写死 left/center 会顶掉它 —— 生活渐变四款就是这样踩的。 */
      }
      /* ── 发丝级悬停滚动条 ──
         默认完全隐形（轨道与滑块皆透明），鼠标悬停卡片时才浮现 3px 淡墨滑块。
         既有「还有更多内容」的提示，又不破坏设计。勿改 scrollbar-width:none。 */
      .tw-card[data-paper="抓重点1"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="抓重点1"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="抓重点1"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="抓重点1"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      /* ── 设计图（卡片背景）──
         TODO: 用上面的命令生成 data-URI 整行替换。
         优先矢量 SVG（无限清晰）；若只有位图，长边务必 ≥1600px。
         background-size:100% 100% 会拉伸，故背景图宽高比必须与 aspect-ratio 一致。 */
      .tw-card[data-paper="抓重点1"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjc3IDI3Ny41Ij4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9InA5MTQ2Ni1maWx0ZXItMSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIzNCIgeT0iMzQuNSIgd2lkdGg9IjI0NSIgaGVpZ2h0PSIyNDUiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjUiLz48L2ZpbHRlcj4KICAgIDxmaWx0ZXIgaWQ9InA5MTQ2Ni1maWx0ZXItMiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSItMiIgeT0iLTIiIHdpZHRoPSIxMDciIGhlaWdodD0iMTA3IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI1Ii8+PC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGlkPSJwOTE0NjYtQXNzZXRfMTA4IiBkYXRhLW5hbWU9IkFzc2V0IDEwOCI+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHBhdGggZD0iTTYzIDQzLjUgTDI1MCA0My41IEMyNjEuMDQzIDQzLjUgMjcwIDUyLjQ1NyAyNzAgNjMuNSBMMjcwIDI1MC41IEMyNzAgMjYxLjU0MyAyNjEuMDQzIDI3MC41IDI1MCAyNzAuNSBMNjMgMjcwLjUgQzUxLjk1NyAyNzAuNSA0MyAyNjEuNTQzIDQzIDI1MC41IEw0MyA2My41IEM0MyA1Mi40NTcgNTEuOTU3IDQzLjUgNjMgNDMuNSBaIiBmaWxsPSIjZmZmZmZmIi8+CiAgICAgICAgPHBhdGggZD0iTTIwLjAzNCAyMC4wMzQgQzM3LjQxMSAyLjY1NyA2NS41ODkgMi42NTcgODIuOTY2IDIwLjAzNCBDMTAwLjM0MyAzNy40MTEgMTAwLjM0MyA2NS41ODkgODIuOTY2IDgyLjk2NiBDNjUuNTg5IDEwMC4zNDMgMzcuNDExIDEwMC4zNDMgMjAuMDM0IDgyLjk2NiBDMi42NTcgNjUuNTg5IDIuNjU3IDM3LjQxMSAyMC4wMzQgMjAuMDM0IFoiIGZpbGw9IiNmZmZmZmYiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8ZyBmaWx0ZXI9InVybCgjcDkxNDY2LWZpbHRlci0xKSI+CiAgICAgICAgICA8cGF0aCBkPSJNNjMgNTEuNSBMMjUwIDUxLjUgQzI1Ni42MjcgNTEuNSAyNjIgNTYuODczIDI2MiA2My41IEwyNjIgMjUwLjUgQzI2MiAyNTcuMTI3IDI1Ni42MjcgMjYyLjUgMjUwIDI2Mi41IEw2MyAyNjIuNSBDNTYuMzczIDI2Mi41IDUxIDI1Ny4xMjcgNTEgMjUwLjUgTDUxIDYzLjUgQzUxIDU2Ljg3MyA1Ni4zNzMgNTEuNSA2MyA1MS41IFoiIGZpbGw9IiNmZmI1ZDUiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGcgZmlsdGVyPSJ1cmwoI3A5MTQ2Ni1maWx0ZXItMikiPgogICAgICAgICAgPGNpcmNsZSBjeD0iNTEuNSIgY3k9IjUxLjUiIHI9IjM2LjUiIGZpbGw9IiNmZmI1ZDUiLz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgICAgPGNpcmNsZSBjeD0iNTEuNSIgY3k9IjUxLjUiIHI9IjIzLjA5MiIgZmlsbD0iI2ZmZmZmZiIvPgogICAgICA8dGV4dCB0cmFuc2Zvcm09Im1hdHJpeCgyLjUgMCAwIDIuNSA0MyA2MCkiIHg9IjAiIHk9IjAiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZvbnQtZmFtaWx5PSJNaWFvWmktWXVuWWluZ1RpLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiNmZmI1ZDUiPjx0c3BhbiB4PSIwIiB5PSIwIj4xPC90c3Bhbj48L3RleHQ+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  // paper 用：返回贴纸 DOM（本模板用 preview 作占位，按需改为 render() 自有结构）
  render() {
    return `<div class="bm-sticker-抓重点1"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_抓重点1 = material;
