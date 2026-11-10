/**
 * 竹林便签素材市场 · paper（便签皮肤）模板
 * ============================================================================
 * 这不是上架素材（文件名以 _ 开头，manifest 不登记，闸门不扫描）。
 * 新皮肤从它复制，把 TODO 填掉即可——下面每一条规则都对应一次真实事故。
 *
 * 【使用步骤】
 *   1. cp materials/_template.paper.js materials/砚.js
 *   2. 全文替换两处命名：
 *        __bamboo_material_砚   （全局变量，需与文件名一致）
 *        data-paper="砚"         （css 作用域锚点）
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

// 文件名: 砚.js  →  全局变量: __bamboo_material_砚
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利

const material = {
  type: 'paper',                 // 必填：paper = 便签皮肤（拖进画布新建卡片）
  name: '砚',            // TODO: 市场展示名，与文件名一致

  // 市场列表缩略图（内联 SVG，零外链）。
  // 注意：这里是【缩略图】，不是卡片背景——卡片背景在 css() 的 ::after 里。
  // 根 <svg> 必须自带 width="100%" height="100%"；禁止 <style> / class= / 铺满画布的实色 rect。
  preview: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 647.262 252.529">
  <defs>
    </defs>
  <g id="p30746-Asset_119" data-name="Asset 119">
    <g>
      <path d="M0 29.653 C0 13.276 13.276 0 29.653 0 L402.653 0 C417.477 0 429.76 10.877 431.957 25.085 C434.154 10.877 446.437 0 461.26 0 L617.608 0 C633.985 0 647.262 13.276 647.262 29.653 L647.262 222.875 C647.262 239.252 633.985 252.529 617.608 252.529 L461.26 252.529 C446.437 252.529 434.154 241.652 431.957 227.444 C429.76 241.652 417.477 252.529 402.653 252.529 L29.653 252.529 C13.276 252.529 0 239.252 0 222.875 Z" fill="#eceee1"/>
      <path d="M29.653 13.99 L402.653 13.99 C406.704 13.99 410.232 15.5 412.889 17.797 C415.576 20.121 417.539 23.399 418.13 27.223 C419.185 34.043 425.055 39.075 431.957 39.075 C438.858 39.075 444.728 34.043 445.783 27.223 C446.374 23.399 448.337 20.121 451.025 17.797 C453.681 15.5 457.209 13.99 461.26 13.99 L617.608 13.99 C626.263 13.99 633.271 20.999 633.271 29.653 L633.271 222.875 C633.271 231.53 626.263 238.538 617.608 238.538 L461.26 238.538 C457.209 238.538 453.681 237.029 451.025 234.732 C448.337 232.408 446.374 229.129 445.783 225.306 C444.728 218.486 438.858 213.453 431.957 213.453 C425.055 213.453 419.185 218.486 418.13 225.306 C417.539 229.129 415.576 232.408 412.889 234.732 C410.232 237.029 406.704 238.538 402.653 238.538 L29.653 238.538 C20.999 238.538 13.99 231.53 13.99 222.875 L13.99 29.653 C13.99 20.999 20.999 13.99 29.653 13.99 Z" fill="#ffffff" stroke="#fbb03b" stroke-width="2.099" stroke-miterlimit="10"/>
      <g>
        <g>
          <path d="M477.577 126.264 C477.577 94.971 505.271 69.603 539.434 69.603 C573.597 69.603 601.292 94.971 601.292 126.264 C601.292 162.225 573.597 182.926 539.434 182.926 C505.271 182.926 477.577 162.545 477.577 126.264 Z" fill="#2a2820"/>
          <ellipse cx="539.434" cy="121.192" rx="61.858" ry="51.589" fill="#a1abaa"/>
          <ellipse cx="539.496" cy="120.759" rx="55.363" ry="46.702" fill="#496769"/>
          <ellipse cx="539.496" cy="123.048" rx="53.383" ry="43.919" fill="#a6a59c"/>
          <ellipse cx="539.496" cy="122.367" rx="30.372" ry="25.918" fill="#ccccb6"/>
          <ellipse cx="539.682" cy="122.12" rx="27.588" ry="23.444" fill="#aeaa94"/>
        </g>
      </g>
      <g>
        <path d="M432.656 39.173 L432.656 43.51 C432.656 44.089 432.186 44.559 431.607 44.559 C431.027 44.559 430.558 44.089 430.558 43.51 L430.558 39.173 C430.558 38.594 431.027 38.124 431.607 38.124 C432.186 38.124 432.656 38.594 432.656 39.173 M432.656 52.183 L432.656 60.856 C432.656 61.435 432.186 61.905 431.607 61.905 C431.027 61.905 430.558 61.435 430.558 60.856 L430.558 52.183 C430.558 51.603 431.027 51.134 431.607 51.134 C432.186 51.134 432.656 51.603 432.656 52.183 M432.656 69.529 L432.656 78.202 C432.656 78.781 432.186 79.251 431.607 79.251 C431.027 79.251 430.558 78.781 430.558 78.202 L430.558 69.529 C430.558 68.949 431.027 68.479 431.607 68.479 C432.186 68.479 432.656 68.949 432.656 69.529 M432.656 86.875 L432.656 95.548 C432.656 96.127 432.186 96.597 431.607 96.597 C431.027 96.597 430.558 96.127 430.558 95.548 L430.558 86.875 C430.558 86.295 431.027 85.825 431.607 85.825 C432.186 85.825 432.656 86.295 432.656 86.875 M432.656 104.22 L432.656 112.893 C432.656 113.473 432.186 113.943 431.607 113.943 C431.027 113.943 430.558 113.473 430.558 112.893 L430.558 104.22 C430.558 103.641 431.027 103.171 431.607 103.171 C432.186 103.171 432.656 103.641 432.656 104.22 M432.656 121.566 L432.656 130.239 C432.656 130.819 432.186 131.289 431.607 131.289 C431.027 131.289 430.558 130.819 430.558 130.239 L430.558 121.566 C430.558 120.987 431.027 120.517 431.607 120.517 C432.186 120.517 432.656 120.987 432.656 121.566 M432.656 138.912 L432.656 147.585 C432.656 148.165 432.186 148.635 431.607 148.635 C431.027 148.635 430.558 148.165 430.558 147.585 L430.558 138.912 C430.558 138.333 431.027 137.863 431.607 137.863 C432.186 137.863 432.656 138.333 432.656 138.912 M432.656 156.258 L432.656 164.931 C432.656 165.511 432.186 165.98 431.607 165.98 C431.027 165.98 430.558 165.511 430.558 164.931 L430.558 156.258 C430.558 155.679 431.027 155.209 431.607 155.209 C432.186 155.209 432.656 155.679 432.656 156.258 M432.656 173.604 L432.656 182.277 C432.656 182.857 432.186 183.326 431.607 183.326 C431.027 183.326 430.558 182.857 430.558 182.277 L430.558 173.604 C430.558 173.025 431.027 172.555 431.607 172.555 C432.186 172.555 432.656 173.025 432.656 173.604 M432.656 190.95 L432.656 199.623 C432.656 200.202 432.186 200.672 431.607 200.672 C431.027 200.672 430.558 200.202 430.558 199.623 L430.558 190.95 C430.558 190.37 431.027 189.901 431.607 189.901 C432.186 189.901 432.656 190.37 432.656 190.95 M432.656 208.296 L432.656 212.632 C432.656 213.212 432.186 213.682 431.607 213.682 C431.027 213.682 430.558 213.212 430.558 212.632 L430.558 208.296 C430.558 207.716 431.027 207.247 431.607 207.247 C432.186 207.247 432.656 207.716 432.656 208.296" fill="#fbb03b"/>
      </g>
    </g>
  </g>
</svg>`,

  // 注入到 .tw-card[data-paper="砚"] 的 CSS（作用域隔离，不会污染其他素材）
  css() {
    return `
      .tw-card[data-paper="砚"]{
        background:transparent;                 /* 必须透明：背景交给设计图，别盖掉它 */
        box-shadow:none;
        border:none;
        aspect-ratio: 647.262 / 252.529;                /* TODO: 设计稿宽高比，须与背景图一致 */
        --rice-paper:transparent;               /* 纸底色；若设计本身是不透明纸才改 */
        --ink-dark:#2e4142;                     /* 主墨色（正文）*/
        --ink-pale:#699496;                     /* 淡墨（标题等弱信息）*/
        --tw-rule-rgb:105,148,150;              /* 分隔线 RGB 三元组，与 --ink-pale 同色 */
        --edge-distort:0;
        --noise:0;
      }
      /* 齿边与噪点元素：不隐藏会带上主题默认装饰 */
      .tw-card[data-paper="砚"] .tw-card-edge,
      .tw-card[data-paper="砚"] .tw-card-noise{display:none;}
      /* 卡片主体：display:block 覆盖主题的 flex 布局，color 供正文继承 */
      .tw-card[data-paper="砚"] .tw-card-main{
        background:transparent; color:#2e4142; position:relative; height:100%; padding:0; display:block;
      }
      /* 主题自带的标题栏：本设计自带标题，隐藏掉 */
      .tw-card[data-paper="砚"] .tw-card-title{ visibility:hidden; }
      /* 交互层铺满卡片；border:none 是关键——清掉主题默认的 2px 下边框，否则卡片底部多一条灰线 */
      .tw-card[data-paper="砚"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      /* ── 文字编辑区：4 个百分比定义「用户能输入文字」的范围 ──
         top/left/right/bottom 都是相对于卡片。建议先用设计稿量出可写字块的位置。
         这里【不要写 font-size】——字号由主题 var(--tw-fs-base) 联动 A↑A↓ 按钮，
         paper 规则特异性更高，写死即使字号调节失效。 */
      .tw-card[data-paper="砚"] .tw-card-text{
        position:absolute; top:13.5%; left:5.5%; right:36%; bottom:13.5%;
        color:#2e4142; z-index:2; overflow:auto;
        /* 不要写 text-align：全局 .tw-card-text 已设 justify（两端对齐），
           皮肤规则特异性更高，写死 left/center 会顶掉它 —— 生活渐变四款就是这样踩的。 */
      }
      /* ── 发丝级悬停滚动条 ──
         默认完全隐形（轨道与滑块皆透明），鼠标悬停卡片时才浮现 3px 淡墨滑块。
         既有「还有更多内容」的提示，又不破坏设计。勿改 scrollbar-width:none。 */
      .tw-card[data-paper="砚"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="砚"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="砚"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="砚"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      /* ── 设计图（卡片背景）──
         TODO: 用上面的命令生成 data-URI 整行替换。
         优先矢量 SVG（无限清晰）；若只有位图，长边务必 ≥1600px。
         background-size:100% 100% 会拉伸，故背景图宽高比必须与 aspect-ratio 一致。 */
      .tw-card[data-paper="砚"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        /* 复刻主题便签档投影（notes.css 的两层外阴影，梦珑系列即用这套数值）：
           drop-shadow 不支持 spread / inset，故去掉 -2px spread 与 inset 白高光
           （inset 是矩形盒专属，正是透明切割式纸样顶部杂线的元凶）；
           沿 ::after 的 SVG alpha 轮廓生成，贴合圆角 / 双纸 / 票券。
           --deep-rgb 随明暗主题切换，fallback 为浅色值。 */
        filter:drop-shadow(0 4px 10px rgba(var(--deep-rgb,45,90,39),.12)) drop-shadow(0 1px 3px rgba(var(--deep-rgb,45,90,39),.09));
        background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNjQ3LjI2MiAyNTIuNTI5Ij4KICA8ZGVmcz4KICAgIDwvZGVmcz4KICA8ZyBpZD0icDMwNzQ2LUFzc2V0XzExOSIgZGF0YS1uYW1lPSJBc3NldCAxMTkiPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Ik0wIDI5LjY1MyBDMCAxMy4yNzYgMTMuMjc2IDAgMjkuNjUzIDAgTDQwMi42NTMgMCBDNDE3LjQ3NyAwIDQyOS43NiAxMC44NzcgNDMxLjk1NyAyNS4wODUgQzQzNC4xNTQgMTAuODc3IDQ0Ni40MzcgMCA0NjEuMjYgMCBMNjE3LjYwOCAwIEM2MzMuOTg1IDAgNjQ3LjI2MiAxMy4yNzYgNjQ3LjI2MiAyOS42NTMgTDY0Ny4yNjIgMjIyLjg3NSBDNjQ3LjI2MiAyMzkuMjUyIDYzMy45ODUgMjUyLjUyOSA2MTcuNjA4IDI1Mi41MjkgTDQ2MS4yNiAyNTIuNTI5IEM0NDYuNDM3IDI1Mi41MjkgNDM0LjE1NCAyNDEuNjUyIDQzMS45NTcgMjI3LjQ0NCBDNDI5Ljc2IDI0MS42NTIgNDE3LjQ3NyAyNTIuNTI5IDQwMi42NTMgMjUyLjUyOSBMMjkuNjUzIDI1Mi41MjkgQzEzLjI3NiAyNTIuNTI5IDAgMjM5LjI1MiAwIDIyMi44NzUgWiIgZmlsbD0iI2VjZWVlMSIvPgogICAgICA8cGF0aCBkPSJNMjkuNjUzIDEzLjk5IEw0MDIuNjUzIDEzLjk5IEM0MDYuNzA0IDEzLjk5IDQxMC4yMzIgMTUuNSA0MTIuODg5IDE3Ljc5NyBDNDE1LjU3NiAyMC4xMjEgNDE3LjUzOSAyMy4zOTkgNDE4LjEzIDI3LjIyMyBDNDE5LjE4NSAzNC4wNDMgNDI1LjA1NSAzOS4wNzUgNDMxLjk1NyAzOS4wNzUgQzQzOC44NTggMzkuMDc1IDQ0NC43MjggMzQuMDQzIDQ0NS43ODMgMjcuMjIzIEM0NDYuMzc0IDIzLjM5OSA0NDguMzM3IDIwLjEyMSA0NTEuMDI1IDE3Ljc5NyBDNDUzLjY4MSAxNS41IDQ1Ny4yMDkgMTMuOTkgNDYxLjI2IDEzLjk5IEw2MTcuNjA4IDEzLjk5IEM2MjYuMjYzIDEzLjk5IDYzMy4yNzEgMjAuOTk5IDYzMy4yNzEgMjkuNjUzIEw2MzMuMjcxIDIyMi44NzUgQzYzMy4yNzEgMjMxLjUzIDYyNi4yNjMgMjM4LjUzOCA2MTcuNjA4IDIzOC41MzggTDQ2MS4yNiAyMzguNTM4IEM0NTcuMjA5IDIzOC41MzggNDUzLjY4MSAyMzcuMDI5IDQ1MS4wMjUgMjM0LjczMiBDNDQ4LjMzNyAyMzIuNDA4IDQ0Ni4zNzQgMjI5LjEyOSA0NDUuNzgzIDIyNS4zMDYgQzQ0NC43MjggMjE4LjQ4NiA0MzguODU4IDIxMy40NTMgNDMxLjk1NyAyMTMuNDUzIEM0MjUuMDU1IDIxMy40NTMgNDE5LjE4NSAyMTguNDg2IDQxOC4xMyAyMjUuMzA2IEM0MTcuNTM5IDIyOS4xMjkgNDE1LjU3NiAyMzIuNDA4IDQxMi44ODkgMjM0LjczMiBDNDEwLjIzMiAyMzcuMDI5IDQwNi43MDQgMjM4LjUzOCA0MDIuNjUzIDIzOC41MzggTDI5LjY1MyAyMzguNTM4IEMyMC45OTkgMjM4LjUzOCAxMy45OSAyMzEuNTMgMTMuOTkgMjIyLjg3NSBMMTMuOTkgMjkuNjUzIEMxMy45OSAyMC45OTkgMjAuOTk5IDEzLjk5IDI5LjY1MyAxMy45OSBaIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmYmIwM2IiIHN0cm9rZS13aWR0aD0iMi4wOTkiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPgogICAgICA8Zz4KICAgICAgICA8Zz4KICAgICAgICAgIDxwYXRoIGQ9Ik00NzcuNTc3IDEyNi4yNjQgQzQ3Ny41NzcgOTQuOTcxIDUwNS4yNzEgNjkuNjAzIDUzOS40MzQgNjkuNjAzIEM1NzMuNTk3IDY5LjYwMyA2MDEuMjkyIDk0Ljk3MSA2MDEuMjkyIDEyNi4yNjQgQzYwMS4yOTIgMTYyLjIyNSA1NzMuNTk3IDE4Mi45MjYgNTM5LjQzNCAxODIuOTI2IEM1MDUuMjcxIDE4Mi45MjYgNDc3LjU3NyAxNjIuNTQ1IDQ3Ny41NzcgMTI2LjI2NCBaIiBmaWxsPSIjMmEyODIwIi8+CiAgICAgICAgICA8ZWxsaXBzZSBjeD0iNTM5LjQzNCIgY3k9IjEyMS4xOTIiIHJ4PSI2MS44NTgiIHJ5PSI1MS41ODkiIGZpbGw9IiNhMWFiYWEiLz4KICAgICAgICAgIDxlbGxpcHNlIGN4PSI1MzkuNDk2IiBjeT0iMTIwLjc1OSIgcng9IjU1LjM2MyIgcnk9IjQ2LjcwMiIgZmlsbD0iIzQ5Njc2OSIvPgogICAgICAgICAgPGVsbGlwc2UgY3g9IjUzOS40OTYiIGN5PSIxMjMuMDQ4IiByeD0iNTMuMzgzIiByeT0iNDMuOTE5IiBmaWxsPSIjYTZhNTljIi8+CiAgICAgICAgICA8ZWxsaXBzZSBjeD0iNTM5LjQ5NiIgY3k9IjEyMi4zNjciIHJ4PSIzMC4zNzIiIHJ5PSIyNS45MTgiIGZpbGw9IiNjY2NjYjYiLz4KICAgICAgICAgIDxlbGxpcHNlIGN4PSI1MzkuNjgyIiBjeT0iMTIyLjEyIiByeD0iMjcuNTg4IiByeT0iMjMuNDQ0IiBmaWxsPSIjYWVhYTk0Ii8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGQ9Ik00MzIuNjU2IDM5LjE3MyBMNDMyLjY1NiA0My41MSBDNDMyLjY1NiA0NC4wODkgNDMyLjE4NiA0NC41NTkgNDMxLjYwNyA0NC41NTkgQzQzMS4wMjcgNDQuNTU5IDQzMC41NTggNDQuMDg5IDQzMC41NTggNDMuNTEgTDQzMC41NTggMzkuMTczIEM0MzAuNTU4IDM4LjU5NCA0MzEuMDI3IDM4LjEyNCA0MzEuNjA3IDM4LjEyNCBDNDMyLjE4NiAzOC4xMjQgNDMyLjY1NiAzOC41OTQgNDMyLjY1NiAzOS4xNzMgTTQzMi42NTYgNTIuMTgzIEw0MzIuNjU2IDYwLjg1NiBDNDMyLjY1NiA2MS40MzUgNDMyLjE4NiA2MS45MDUgNDMxLjYwNyA2MS45MDUgQzQzMS4wMjcgNjEuOTA1IDQzMC41NTggNjEuNDM1IDQzMC41NTggNjAuODU2IEw0MzAuNTU4IDUyLjE4MyBDNDMwLjU1OCA1MS42MDMgNDMxLjAyNyA1MS4xMzQgNDMxLjYwNyA1MS4xMzQgQzQzMi4xODYgNTEuMTM0IDQzMi42NTYgNTEuNjAzIDQzMi42NTYgNTIuMTgzIE00MzIuNjU2IDY5LjUyOSBMNDMyLjY1NiA3OC4yMDIgQzQzMi42NTYgNzguNzgxIDQzMi4xODYgNzkuMjUxIDQzMS42MDcgNzkuMjUxIEM0MzEuMDI3IDc5LjI1MSA0MzAuNTU4IDc4Ljc4MSA0MzAuNTU4IDc4LjIwMiBMNDMwLjU1OCA2OS41MjkgQzQzMC41NTggNjguOTQ5IDQzMS4wMjcgNjguNDc5IDQzMS42MDcgNjguNDc5IEM0MzIuMTg2IDY4LjQ3OSA0MzIuNjU2IDY4Ljk0OSA0MzIuNjU2IDY5LjUyOSBNNDMyLjY1NiA4Ni44NzUgTDQzMi42NTYgOTUuNTQ4IEM0MzIuNjU2IDk2LjEyNyA0MzIuMTg2IDk2LjU5NyA0MzEuNjA3IDk2LjU5NyBDNDMxLjAyNyA5Ni41OTcgNDMwLjU1OCA5Ni4xMjcgNDMwLjU1OCA5NS41NDggTDQzMC41NTggODYuODc1IEM0MzAuNTU4IDg2LjI5NSA0MzEuMDI3IDg1LjgyNSA0MzEuNjA3IDg1LjgyNSBDNDMyLjE4NiA4NS44MjUgNDMyLjY1NiA4Ni4yOTUgNDMyLjY1NiA4Ni44NzUgTTQzMi42NTYgMTA0LjIyIEw0MzIuNjU2IDExMi44OTMgQzQzMi42NTYgMTEzLjQ3MyA0MzIuMTg2IDExMy45NDMgNDMxLjYwNyAxMTMuOTQzIEM0MzEuMDI3IDExMy45NDMgNDMwLjU1OCAxMTMuNDczIDQzMC41NTggMTEyLjg5MyBMNDMwLjU1OCAxMDQuMjIgQzQzMC41NTggMTAzLjY0MSA0MzEuMDI3IDEwMy4xNzEgNDMxLjYwNyAxMDMuMTcxIEM0MzIuMTg2IDEwMy4xNzEgNDMyLjY1NiAxMDMuNjQxIDQzMi42NTYgMTA0LjIyIE00MzIuNjU2IDEyMS41NjYgTDQzMi42NTYgMTMwLjIzOSBDNDMyLjY1NiAxMzAuODE5IDQzMi4xODYgMTMxLjI4OSA0MzEuNjA3IDEzMS4yODkgQzQzMS4wMjcgMTMxLjI4OSA0MzAuNTU4IDEzMC44MTkgNDMwLjU1OCAxMzAuMjM5IEw0MzAuNTU4IDEyMS41NjYgQzQzMC41NTggMTIwLjk4NyA0MzEuMDI3IDEyMC41MTcgNDMxLjYwNyAxMjAuNTE3IEM0MzIuMTg2IDEyMC41MTcgNDMyLjY1NiAxMjAuOTg3IDQzMi42NTYgMTIxLjU2NiBNNDMyLjY1NiAxMzguOTEyIEw0MzIuNjU2IDE0Ny41ODUgQzQzMi42NTYgMTQ4LjE2NSA0MzIuMTg2IDE0OC42MzUgNDMxLjYwNyAxNDguNjM1IEM0MzEuMDI3IDE0OC42MzUgNDMwLjU1OCAxNDguMTY1IDQzMC41NTggMTQ3LjU4NSBMNDMwLjU1OCAxMzguOTEyIEM0MzAuNTU4IDEzOC4zMzMgNDMxLjAyNyAxMzcuODYzIDQzMS42MDcgMTM3Ljg2MyBDNDMyLjE4NiAxMzcuODYzIDQzMi42NTYgMTM4LjMzMyA0MzIuNjU2IDEzOC45MTIgTTQzMi42NTYgMTU2LjI1OCBMNDMyLjY1NiAxNjQuOTMxIEM0MzIuNjU2IDE2NS41MTEgNDMyLjE4NiAxNjUuOTggNDMxLjYwNyAxNjUuOTggQzQzMS4wMjcgMTY1Ljk4IDQzMC41NTggMTY1LjUxMSA0MzAuNTU4IDE2NC45MzEgTDQzMC41NTggMTU2LjI1OCBDNDMwLjU1OCAxNTUuNjc5IDQzMS4wMjcgMTU1LjIwOSA0MzEuNjA3IDE1NS4yMDkgQzQzMi4xODYgMTU1LjIwOSA0MzIuNjU2IDE1NS42NzkgNDMyLjY1NiAxNTYuMjU4IE00MzIuNjU2IDE3My42MDQgTDQzMi42NTYgMTgyLjI3NyBDNDMyLjY1NiAxODIuODU3IDQzMi4xODYgMTgzLjMyNiA0MzEuNjA3IDE4My4zMjYgQzQzMS4wMjcgMTgzLjMyNiA0MzAuNTU4IDE4Mi44NTcgNDMwLjU1OCAxODIuMjc3IEw0MzAuNTU4IDE3My42MDQgQzQzMC41NTggMTczLjAyNSA0MzEuMDI3IDE3Mi41NTUgNDMxLjYwNyAxNzIuNTU1IEM0MzIuMTg2IDE3Mi41NTUgNDMyLjY1NiAxNzMuMDI1IDQzMi42NTYgMTczLjYwNCBNNDMyLjY1NiAxOTAuOTUgTDQzMi42NTYgMTk5LjYyMyBDNDMyLjY1NiAyMDAuMjAyIDQzMi4xODYgMjAwLjY3MiA0MzEuNjA3IDIwMC42NzIgQzQzMS4wMjcgMjAwLjY3MiA0MzAuNTU4IDIwMC4yMDIgNDMwLjU1OCAxOTkuNjIzIEw0MzAuNTU4IDE5MC45NSBDNDMwLjU1OCAxOTAuMzcgNDMxLjAyNyAxODkuOTAxIDQzMS42MDcgMTg5LjkwMSBDNDMyLjE4NiAxODkuOTAxIDQzMi42NTYgMTkwLjM3IDQzMi42NTYgMTkwLjk1IE00MzIuNjU2IDIwOC4yOTYgTDQzMi42NTYgMjEyLjYzMiBDNDMyLjY1NiAyMTMuMjEyIDQzMi4xODYgMjEzLjY4MiA0MzEuNjA3IDIxMy42ODIgQzQzMS4wMjcgMjEzLjY4MiA0MzAuNTU4IDIxMy4yMTIgNDMwLjU1OCAyMTIuNjMyIEw0MzAuNTU4IDIwOC4yOTYgQzQzMC41NTggMjA3LjcxNiA0MzEuMDI3IDIwNy4yNDcgNDMxLjYwNyAyMDcuMjQ3IEM0MzIuMTg2IDIwNy4yNDcgNDMyLjY1NiAyMDcuNzE2IDQzMi42NTYgMjA4LjI5NiIgZmlsbD0iI2ZiYjAzYiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  // paper 用：返回贴纸 DOM（本模板用 preview 作占位，按需改为 render() 自有结构）
  render() {
    return `<div class="bm-sticker-砚"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_砚 = material;
