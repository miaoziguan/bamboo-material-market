/**
 * 竹林便签素材市场 · paper（便签皮肤）模板
 * ============================================================================
 * 这不是上架素材（文件名以 _ 开头，manifest 不登记，闸门不扫描）。
 * 新皮肤从它复制，把 TODO 填掉即可——下面每一条规则都对应一次真实事故。
 *
 * 【使用步骤】
 *   1. cp materials/_template.paper.js materials/抓重点3.js
 *   2. 全文替换两处命名：
 *        __bamboo_material_抓重点3   （全局变量，需与文件名一致）
 *        data-paper="抓重点3"         （css 作用域锚点）
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

// 文件名: 抓重点3.js  →  全局变量: __bamboo_material_抓重点3
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利

const material = {
  type: 'paper',                 // 必填：paper = 便签皮肤（拖进画布新建卡片）
  name: '抓重点3',            // TODO: 市场展示名，与文件名一致

  // 市场列表缩略图（内联 SVG，零外链）。
  // 注意：这里是【缩略图】，不是卡片背景——卡片背景在 css() 的 ::after 里。
  // 根 <svg> 必须自带 width="100%" height="100%"；禁止 <style> / class= / 铺满画布的实色 rect。
  preview: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 277 277.5">
  <defs>
    <filter id="p91468-filter-1" filterUnits="userSpaceOnUse" x="34" y="34.5" width="245" height="245" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter>
    <filter id="p91468-filter-2" filterUnits="userSpaceOnUse" x="-2" y="-2" width="107" height="107" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter>
  </defs>
  <g id="p91468-Asset_110" data-name="Asset 110">
    <g>
      <g>
        <path d="M63 43.5 L250 43.5 C261.042 43.5 270 52.457 270 63.5 L270 250.5 C270 261.542 261.042 270.5 250 270.5 L63 270.5 C51.957 270.5 43 261.542 43 250.5 L43 63.5 C43 52.457 51.957 43.5 63 43.5 Z" fill="#ffffff"/>
        <path d="M20.033 20.033 C37.41 2.656 65.589 2.656 82.966 20.033 C100.343 37.41 100.343 65.589 82.966 82.966 C65.589 100.343 37.41 100.343 20.033 82.966 C2.656 65.589 2.656 37.41 20.033 20.033 Z" fill="#ffffff"/>
      </g>
      <g>
        <g filter="url(#p91468-filter-1)">
          <path d="M63 51.5 L250 51.5 C256.627 51.5 262 56.873 262 63.5 L262 250.5 C262 257.127 256.627 262.5 250 262.5 L63 262.5 C56.373 262.5 51 257.127 51 250.5 L51 63.5 C51 56.873 56.373 51.5 63 51.5 Z" fill="#d4e9ca"/>
        </g>
        <g filter="url(#p91468-filter-2)">
          <circle cx="51.5" cy="51.5" r="36.5" fill="#d4e9ca"/>
        </g>
      </g>
      <circle cx="51.5" cy="51.5" r="23.092" fill="#ffffff"/>
      <path transform="matrix(2.5 0 0 2.5 43 61)" fill="#d4e9ca" d="M3.66 -8.34Q4.344 -8.34 4.968 -8.088Q5.592 -7.836 6.012 -7.338Q6.432 -6.84 6.516 -6.156L6.54 -5.796Q6.54 -5.016 6.12 -4.488Q5.7 -3.96 5.088 -3.672Q5.784 -3.456 6.198 -2.964Q6.612 -2.472 6.648 -1.8Q6.708 -0.804 6.264 -0.084Q5.82 0.636 5.1 1.002Q4.38 1.368 3.612 1.368Q2.856 1.368 2.16 1.092Q1.464 0.816 1.032 0.264Q0.6 -0.288 0.6 -1.08Q0.6 -1.356 0.648 -1.596Q0.72 -2.016 1.062 -2.244Q1.404 -2.472 1.824 -2.472Q2.256 -2.472 2.55 -2.238Q2.844 -2.004 2.808 -1.596Q2.772 -1.236 2.772 -0.948Q2.772 -0.276 2.97 0.006Q3.168 0.288 3.612 0.288Q3.792 0.288 4.002 0.036Q4.212 -0.216 4.356 -0.69Q4.5 -1.164 4.5 -1.8Q4.5 -2.328 4.314 -2.712Q4.128 -3.096 3.54 -3.096Q3.384 -3.096 3.3 -3.084Q3.24 -3.072 3.132 -3.072Q2.844 -3.072 2.694 -3.216Q2.544 -3.36 2.544 -3.576Q2.544 -3.828 2.736 -3.978Q2.928 -4.128 3.204 -4.164Q3.816 -4.26 4.116 -4.806Q4.416 -5.352 4.416 -6Q4.416 -6.384 4.332 -6.6Q4.116 -7.26 3.612 -7.26Q3.348 -7.26 3.168 -7.092Q2.988 -6.924 2.868 -6.564Q2.76 -6.276 2.76 -5.892Q2.76 -5.736 2.772 -5.652L2.784 -5.244Q2.784 -4.848 2.484 -4.632Q2.184 -4.416 1.764 -4.416Q1.332 -4.416 0.996 -4.65Q0.66 -4.884 0.648 -5.292Q0.624 -6.276 1.044 -6.966Q1.464 -7.656 2.166 -7.998Q2.868 -8.34 3.66 -8.34ZM2.292 -5.412Q2.292 -5.64 2.13 -5.802Q1.968 -5.964 1.74 -5.964Q1.512 -5.964 1.344 -5.802Q1.176 -5.64 1.176 -5.412Q1.176 -5.184 1.344 -5.016Q1.512 -4.848 1.74 -4.848Q1.968 -4.848 2.13 -5.016Q2.292 -5.184 2.292 -5.412ZM2.292 -1.452Q2.292 -1.68 2.13 -1.842Q1.968 -2.004 1.74 -2.004Q1.512 -2.004 1.344 -1.842Q1.176 -1.68 1.176 -1.452Q1.176 -1.224 1.344 -1.056Q1.512 -0.888 1.74 -0.888Q1.968 -0.888 2.13 -1.056Q2.292 -1.224 2.292 -1.452Z"/>
    </g>
  </g>
</svg>`,

  // 注入到 .tw-card[data-paper="抓重点3"] 的 CSS（作用域隔离，不会污染其他素材）
  css() {
    return `
      .tw-card[data-paper="抓重点3"]{
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
      .tw-card[data-paper="抓重点3"] .tw-card-edge,
      .tw-card[data-paper="抓重点3"] .tw-card-noise{display:none;}
      /* 卡片主体：display:block 覆盖主题的 flex 布局，color 供正文继承 */
      .tw-card[data-paper="抓重点3"] .tw-card-main{
        background:transparent; color:#1a1a1a; position:relative; height:100%; padding:0; display:block;
      }
      /* 主题自带的标题栏：本设计自带标题，隐藏掉 */
      .tw-card[data-paper="抓重点3"] .tw-card-title{ visibility:hidden; }
      /* 交互层铺满卡片；border:none 是关键——清掉主题默认的 2px 下边框，否则卡片底部多一条灰线 */
      .tw-card[data-paper="抓重点3"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      /* ── 文字编辑区：4 个百分比定义「用户能输入文字」的范围 ──
         top/left/right/bottom 都是相对于卡片。建议先用设计稿量出可写字块的位置。
         这里【不要写 font-size】——字号由主题 var(--tw-fs-base) 联动 A↑A↓ 按钮，
         paper 规则特异性更高，写死即使字号调节失效。 */
      .tw-card[data-paper="抓重点3"] .tw-card-text{
        position:absolute; top:30%; left:24%; right:10%; bottom:10%;
        color:#1a1a1a; z-index:2; overflow:auto;
        /* 不要写 text-align：全局 .tw-card-text 已设 justify（两端对齐），
           皮肤规则特异性更高，写死 left/center 会顶掉它 —— 生活渐变四款就是这样踩的。 */
      }
      /* ── 发丝级悬停滚动条 ──
         默认完全隐形（轨道与滑块皆透明），鼠标悬停卡片时才浮现 3px 淡墨滑块。
         既有「还有更多内容」的提示，又不破坏设计。勿改 scrollbar-width:none。 */
      .tw-card[data-paper="抓重点3"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="抓重点3"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="抓重点3"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="抓重点3"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      /* ── 设计图（卡片背景）──
         TODO: 用上面的命令生成 data-URI 整行替换。
         优先矢量 SVG（无限清晰）；若只有位图，长边务必 ≥1600px。
         background-size:100% 100% 会拉伸，故背景图宽高比必须与 aspect-ratio 一致。 */
      .tw-card[data-paper="抓重点3"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjc3IDI3Ny41Ij4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9InA5MTQ2OC1maWx0ZXItMSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIzNCIgeT0iMzQuNSIgd2lkdGg9IjI0NSIgaGVpZ2h0PSIyNDUiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjUiLz48L2ZpbHRlcj4KICAgIDxmaWx0ZXIgaWQ9InA5MTQ2OC1maWx0ZXItMiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSItMiIgeT0iLTIiIHdpZHRoPSIxMDciIGhlaWdodD0iMTA3IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI1Ii8+PC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGlkPSJwOTE0NjgtQXNzZXRfMTEwIiBkYXRhLW5hbWU9IkFzc2V0IDExMCI+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHBhdGggZD0iTTYzIDQzLjUgTDI1MCA0My41IEMyNjEuMDQyIDQzLjUgMjcwIDUyLjQ1NyAyNzAgNjMuNSBMMjcwIDI1MC41IEMyNzAgMjYxLjU0MiAyNjEuMDQyIDI3MC41IDI1MCAyNzAuNSBMNjMgMjcwLjUgQzUxLjk1NyAyNzAuNSA0MyAyNjEuNTQyIDQzIDI1MC41IEw0MyA2My41IEM0MyA1Mi40NTcgNTEuOTU3IDQzLjUgNjMgNDMuNSBaIiBmaWxsPSIjZmZmZmZmIi8+CiAgICAgICAgPHBhdGggZD0iTTIwLjAzMyAyMC4wMzMgQzM3LjQxIDIuNjU2IDY1LjU4OSAyLjY1NiA4Mi45NjYgMjAuMDMzIEMxMDAuMzQzIDM3LjQxIDEwMC4zNDMgNjUuNTg5IDgyLjk2NiA4Mi45NjYgQzY1LjU4OSAxMDAuMzQzIDM3LjQxIDEwMC4zNDMgMjAuMDMzIDgyLjk2NiBDMi42NTYgNjUuNTg5IDIuNjU2IDM3LjQxIDIwLjAzMyAyMC4wMzMgWiIgZmlsbD0iI2ZmZmZmZiIvPgogICAgICA8L2c+CiAgICAgIDxnPgogICAgICAgIDxnIGZpbHRlcj0idXJsKCNwOTE0NjgtZmlsdGVyLTEpIj4KICAgICAgICAgIDxwYXRoIGQ9Ik02MyA1MS41IEwyNTAgNTEuNSBDMjU2LjYyNyA1MS41IDI2MiA1Ni44NzMgMjYyIDYzLjUgTDI2MiAyNTAuNSBDMjYyIDI1Ny4xMjcgMjU2LjYyNyAyNjIuNSAyNTAgMjYyLjUgTDYzIDI2Mi41IEM1Ni4zNzMgMjYyLjUgNTEgMjU3LjEyNyA1MSAyNTAuNSBMNTEgNjMuNSBDNTEgNTYuODczIDU2LjM3MyA1MS41IDYzIDUxLjUgWiIgZmlsbD0iI2Q0ZTljYSIvPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBmaWx0ZXI9InVybCgjcDkxNDY4LWZpbHRlci0yKSI+CiAgICAgICAgICA8Y2lyY2xlIGN4PSI1MS41IiBjeT0iNTEuNSIgcj0iMzYuNSIgZmlsbD0iI2Q0ZTljYSIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgICA8Y2lyY2xlIGN4PSI1MS41IiBjeT0iNTEuNSIgcj0iMjMuMDkyIiBmaWxsPSIjZmZmZmZmIi8+CiAgICAgIDxwYXRoIHRyYW5zZm9ybT0ibWF0cml4KDIuNSAwIDAgMi41IDQzIDYxKSIgZmlsbD0iI2Q0ZTljYSIgZD0iTTMuNjYgLTguMzRRNC4zNDQgLTguMzQgNC45NjggLTguMDg4UTUuNTkyIC03LjgzNiA2LjAxMiAtNy4zMzhRNi40MzIgLTYuODQgNi41MTYgLTYuMTU2TDYuNTQgLTUuNzk2UTYuNTQgLTUuMDE2IDYuMTIgLTQuNDg4UTUuNyAtMy45NiA1LjA4OCAtMy42NzJRNS43ODQgLTMuNDU2IDYuMTk4IC0yLjk2NFE2LjYxMiAtMi40NzIgNi42NDggLTEuOFE2LjcwOCAtMC44MDQgNi4yNjQgLTAuMDg0UTUuODIgMC42MzYgNS4xIDEuMDAyUTQuMzggMS4zNjggMy42MTIgMS4zNjhRMi44NTYgMS4zNjggMi4xNiAxLjA5MlExLjQ2NCAwLjgxNiAxLjAzMiAwLjI2NFEwLjYgLTAuMjg4IDAuNiAtMS4wOFEwLjYgLTEuMzU2IDAuNjQ4IC0xLjU5NlEwLjcyIC0yLjAxNiAxLjA2MiAtMi4yNDRRMS40MDQgLTIuNDcyIDEuODI0IC0yLjQ3MlEyLjI1NiAtMi40NzIgMi41NSAtMi4yMzhRMi44NDQgLTIuMDA0IDIuODA4IC0xLjU5NlEyLjc3MiAtMS4yMzYgMi43NzIgLTAuOTQ4UTIuNzcyIC0wLjI3NiAyLjk3IDAuMDA2UTMuMTY4IDAuMjg4IDMuNjEyIDAuMjg4UTMuNzkyIDAuMjg4IDQuMDAyIDAuMDM2UTQuMjEyIC0wLjIxNiA0LjM1NiAtMC42OVE0LjUgLTEuMTY0IDQuNSAtMS44UTQuNSAtMi4zMjggNC4zMTQgLTIuNzEyUTQuMTI4IC0zLjA5NiAzLjU0IC0zLjA5NlEzLjM4NCAtMy4wOTYgMy4zIC0zLjA4NFEzLjI0IC0zLjA3MiAzLjEzMiAtMy4wNzJRMi44NDQgLTMuMDcyIDIuNjk0IC0zLjIxNlEyLjU0NCAtMy4zNiAyLjU0NCAtMy41NzZRMi41NDQgLTMuODI4IDIuNzM2IC0zLjk3OFEyLjkyOCAtNC4xMjggMy4yMDQgLTQuMTY0UTMuODE2IC00LjI2IDQuMTE2IC00LjgwNlE0LjQxNiAtNS4zNTIgNC40MTYgLTZRNC40MTYgLTYuMzg0IDQuMzMyIC02LjZRNC4xMTYgLTcuMjYgMy42MTIgLTcuMjZRMy4zNDggLTcuMjYgMy4xNjggLTcuMDkyUTIuOTg4IC02LjkyNCAyLjg2OCAtNi41NjRRMi43NiAtNi4yNzYgMi43NiAtNS44OTJRMi43NiAtNS43MzYgMi43NzIgLTUuNjUyTDIuNzg0IC01LjI0NFEyLjc4NCAtNC44NDggMi40ODQgLTQuNjMyUTIuMTg0IC00LjQxNiAxLjc2NCAtNC40MTZRMS4zMzIgLTQuNDE2IDAuOTk2IC00LjY1UTAuNjYgLTQuODg0IDAuNjQ4IC01LjI5MlEwLjYyNCAtNi4yNzYgMS4wNDQgLTYuOTY2UTEuNDY0IC03LjY1NiAyLjE2NiAtNy45OThRMi44NjggLTguMzQgMy42NiAtOC4zNFpNMi4yOTIgLTUuNDEyUTIuMjkyIC01LjY0IDIuMTMgLTUuODAyUTEuOTY4IC01Ljk2NCAxLjc0IC01Ljk2NFExLjUxMiAtNS45NjQgMS4zNDQgLTUuODAyUTEuMTc2IC01LjY0IDEuMTc2IC01LjQxMlExLjE3NiAtNS4xODQgMS4zNDQgLTUuMDE2UTEuNTEyIC00Ljg0OCAxLjc0IC00Ljg0OFExLjk2OCAtNC44NDggMi4xMyAtNS4wMTZRMi4yOTIgLTUuMTg0IDIuMjkyIC01LjQxMlpNMi4yOTIgLTEuNDUyUTIuMjkyIC0xLjY4IDIuMTMgLTEuODQyUTEuOTY4IC0yLjAwNCAxLjc0IC0yLjAwNFExLjUxMiAtMi4wMDQgMS4zNDQgLTEuODQyUTEuMTc2IC0xLjY4IDEuMTc2IC0xLjQ1MlExLjE3NiAtMS4yMjQgMS4zNDQgLTEuMDU2UTEuNTEyIC0wLjg4OCAxLjc0IC0wLjg4OFExLjk2OCAtMC44ODggMi4xMyAtMS4wNTZRMi4yOTIgLTEuMjI0IDIuMjkyIC0xLjQ1MloiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  // paper 用：返回贴纸 DOM（本模板用 preview 作占位，按需改为 render() 自有结构）
  render() {
    return `<div class="bm-sticker-抓重点3"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_抓重点3 = material;
