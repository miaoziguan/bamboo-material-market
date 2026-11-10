/**
 * 竹林便签素材市场 · paper（便签皮肤）模板
 * ============================================================================
 * 这不是上架素材（文件名以 _ 开头，manifest 不登记，闸门不扫描）。
 * 新皮肤从它复制，把 TODO 填掉即可——下面每一条规则都对应一次真实事故。
 *
 * 【使用步骤】
 *   1. cp materials/_template.paper.js materials/墨.js
 *   2. 全文替换两处命名：
 *        __bamboo_material_墨   （全局变量，需与文件名一致）
 *        data-paper="墨"         （css 作用域锚点）
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

// 文件名: 墨.js  →  全局变量: __bamboo_material_墨
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利

const material = {
  type: 'paper',                 // 必填：paper = 便签皮肤（拖进画布新建卡片）
  name: '墨',            // TODO: 市场展示名，与文件名一致

  // 市场列表缩略图（内联 SVG，零外链）。
  // 注意：这里是【缩略图】，不是卡片背景——卡片背景在 css() 的 ::after 里。
  // 根 <svg> 必须自带 width="100%" height="100%"；禁止 <style> / class= / 铺满画布的实色 rect。
  preview: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 647.262 252.529">
  <defs>
    </defs>
  <g id="p22696-Asset_117" data-name="Asset 117">
    <g>
      <path d="M0 29.653 C0 13.276 13.276 0 29.653 0 L402.653 0 C417.477 0 429.76 10.877 431.957 25.085 C434.154 10.877 446.437 0 461.26 0 L617.608 0 C633.985 0 647.262 13.276 647.262 29.653 L647.262 222.875 C647.262 239.252 633.985 252.529 617.608 252.529 L461.26 252.529 C446.437 252.529 434.154 241.652 431.957 227.444 C429.76 241.652 417.477 252.529 402.653 252.529 L29.653 252.529 C13.276 252.529 0 239.252 0 222.875 Z" fill="#eceee1"/>
      <path d="M29.653 13.99 L402.653 13.99 C406.704 13.99 410.232 15.5 412.889 17.797 C415.576 20.121 417.539 23.399 418.13 27.223 C419.185 34.043 425.055 39.075 431.957 39.075 C438.858 39.075 444.728 34.043 445.783 27.223 C446.374 23.399 448.337 20.121 451.025 17.797 C453.681 15.5 457.209 13.99 461.26 13.99 L617.608 13.99 C626.263 13.99 633.271 20.999 633.271 29.653 L633.271 222.875 C633.271 231.53 626.263 238.538 617.608 238.538 L461.26 238.538 C457.209 238.538 453.681 237.029 451.025 234.732 C448.337 232.408 446.374 229.129 445.783 225.306 C444.728 218.486 438.858 213.453 431.957 213.453 C425.055 213.453 419.185 218.486 418.13 225.306 C417.539 229.129 415.576 232.408 412.889 234.732 C410.232 237.029 406.704 238.538 402.653 238.538 L29.653 238.538 C20.999 238.538 13.99 231.53 13.99 222.875 L13.99 29.653 C13.99 20.999 20.999 13.99 29.653 13.99 Z" fill="#ffffff" stroke="#fbb03b" stroke-width="2.099" stroke-miterlimit="10"/>
      <g>
        <polygon points="539.832,45.5 526.843,44.16 516.226,202.292 564.882,196.313" fill="#494441"/>
        <path d="M527.462 192.086 L516.432 201.983 L538.66 204.576 C548.144 205.682 557.656 202.76 564.882 196.519 L564.882 196.519 Z" fill="#000000"/>
        <polygon points="527.05,43.644 527.05,191.571 564.882,195.901 564.882,49.108" fill="#21201f" stroke="#f7931e" stroke-width="0.7" stroke-miterlimit="10"/>
        <polygon points="526.843,191.365 516.019,201.776 516.019,61.375 526.843,44.16 526.843,48.298" fill="#000100" stroke="#f7931e" stroke-width="0.7" stroke-miterlimit="10"/>
        <ellipse cx="552.048" cy="209.972" rx="24.792" ry="4.484" fill="#000000"/>
        <ellipse cx="533.698" cy="213.232" rx="16.03" ry="2.899" fill="#000000"/>
        <ellipse cx="555.346" cy="213.953" rx="16.03" ry="2.899" fill="#000000"/>
      </g>
      <g>
        <path d="M432.656 39.173 L432.656 43.51 C432.656 44.089 432.186 44.559 431.607 44.559 C431.027 44.559 430.558 44.089 430.558 43.51 L430.558 39.173 C430.558 38.594 431.027 38.124 431.607 38.124 C432.186 38.124 432.656 38.594 432.656 39.173 M432.656 52.183 L432.656 60.856 C432.656 61.435 432.186 61.905 431.607 61.905 C431.027 61.905 430.558 61.435 430.558 60.856 L430.558 52.183 C430.558 51.603 431.027 51.134 431.607 51.134 C432.186 51.134 432.656 51.603 432.656 52.183 M432.656 69.529 L432.656 78.202 C432.656 78.781 432.186 79.251 431.607 79.251 C431.027 79.251 430.558 78.781 430.558 78.202 L430.558 69.529 C430.558 68.949 431.027 68.479 431.607 68.479 C432.186 68.479 432.656 68.949 432.656 69.529 M432.656 86.875 L432.656 95.548 C432.656 96.127 432.186 96.597 431.607 96.597 C431.027 96.597 430.558 96.127 430.558 95.548 L430.558 86.875 C430.558 86.295 431.027 85.825 431.607 85.825 C432.186 85.825 432.656 86.295 432.656 86.875 M432.656 104.22 L432.656 112.893 C432.656 113.473 432.186 113.943 431.607 113.943 C431.027 113.943 430.558 113.473 430.558 112.893 L430.558 104.22 C430.558 103.641 431.027 103.171 431.607 103.171 C432.186 103.171 432.656 103.641 432.656 104.22 M432.656 121.566 L432.656 130.239 C432.656 130.819 432.186 131.289 431.607 131.289 C431.027 131.289 430.558 130.819 430.558 130.239 L430.558 121.566 C430.558 120.987 431.027 120.517 431.607 120.517 C432.186 120.517 432.656 120.987 432.656 121.566 M432.656 138.912 L432.656 147.585 C432.656 148.165 432.186 148.635 431.607 148.635 C431.027 148.635 430.558 148.165 430.558 147.585 L430.558 138.912 C430.558 138.333 431.027 137.863 431.607 137.863 C432.186 137.863 432.656 138.333 432.656 138.912 M432.656 156.258 L432.656 164.931 C432.656 165.511 432.186 165.98 431.607 165.98 C431.027 165.98 430.558 165.511 430.558 164.931 L430.558 156.258 C430.558 155.679 431.027 155.209 431.607 155.209 C432.186 155.209 432.656 155.679 432.656 156.258 M432.656 173.604 L432.656 182.277 C432.656 182.857 432.186 183.326 431.607 183.326 C431.027 183.326 430.558 182.857 430.558 182.277 L430.558 173.604 C430.558 173.025 431.027 172.555 431.607 172.555 C432.186 172.555 432.656 173.025 432.656 173.604 M432.656 190.95 L432.656 199.623 C432.656 200.202 432.186 200.672 431.607 200.672 C431.027 200.672 430.558 200.202 430.558 199.623 L430.558 190.95 C430.558 190.37 431.027 189.901 431.607 189.901 C432.186 189.901 432.656 190.37 432.656 190.95 M432.656 208.296 L432.656 212.632 C432.656 213.212 432.186 213.682 431.607 213.682 C431.027 213.682 430.558 213.212 430.558 212.632 L430.558 208.296 C430.558 207.716 431.027 207.247 431.607 207.247 C432.186 207.247 432.656 207.716 432.656 208.296" fill="#fbb03b"/>
      </g>
    </g>
  </g>
</svg>`,

  // 注入到 .tw-card[data-paper="墨"] 的 CSS（作用域隔离，不会污染其他素材）
  css() {
    return `
      .tw-card[data-paper="墨"]{
        background:transparent;                 /* 必须透明：背景交给设计图，别盖掉它 */
        box-shadow:none;
        border:none;
        aspect-ratio: 647.262 / 252.529;                /* TODO: 设计稿宽高比，须与背景图一致 */
        --rice-paper:transparent;               /* 纸底色；若设计本身是不透明纸才改 */
        --ink-dark:#3b3735;                     /* 主墨色（正文）*/
        --ink-pale:#877e78;                     /* 淡墨（标题等弱信息）*/
        --tw-rule-rgb:135,126,120;              /* 分隔线 RGB 三元组，与 --ink-pale 同色 */
        --edge-distort:0;
        --noise:0;
      }
      /* 齿边与噪点元素：不隐藏会带上主题默认装饰 */
      .tw-card[data-paper="墨"] .tw-card-edge,
      .tw-card[data-paper="墨"] .tw-card-noise{display:none;}
      /* 卡片主体：display:block 覆盖主题的 flex 布局，color 供正文继承 */
      .tw-card[data-paper="墨"] .tw-card-main{
        background:transparent; color:#3b3735; position:relative; height:100%; padding:0; display:block;
      }
      /* 主题自带的标题栏：本设计自带标题，隐藏掉 */
      .tw-card[data-paper="墨"] .tw-card-title{ visibility:hidden; }
      /* 交互层铺满卡片；border:none 是关键——清掉主题默认的 2px 下边框，否则卡片底部多一条灰线 */
      .tw-card[data-paper="墨"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      /* ── 文字编辑区：4 个百分比定义「用户能输入文字」的范围 ──
         top/left/right/bottom 都是相对于卡片。建议先用设计稿量出可写字块的位置。
         这里【不要写 font-size】——字号由主题 var(--tw-fs-base) 联动 A↑A↓ 按钮，
         paper 规则特异性更高，写死即使字号调节失效。 */
      .tw-card[data-paper="墨"] .tw-card-text{
        position:absolute; top:13.5%; left:5.5%; right:36%; bottom:13.5%;
        color:#3b3735; z-index:2; overflow:auto;
        /* 不要写 text-align：全局 .tw-card-text 已设 justify（两端对齐），
           皮肤规则特异性更高，写死 left/center 会顶掉它 —— 生活渐变四款就是这样踩的。 */
      }
      /* ── 发丝级悬停滚动条 ──
         默认完全隐形（轨道与滑块皆透明），鼠标悬停卡片时才浮现 3px 淡墨滑块。
         既有「还有更多内容」的提示，又不破坏设计。勿改 scrollbar-width:none。 */
      .tw-card[data-paper="墨"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="墨"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="墨"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="墨"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      /* ── 设计图（卡片背景）──
         TODO: 用上面的命令生成 data-URI 整行替换。
         优先矢量 SVG（无限清晰）；若只有位图，长边务必 ≥1600px。
         background-size:100% 100% 会拉伸，故背景图宽高比必须与 aspect-ratio 一致。 */
      .tw-card[data-paper="墨"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        /* 复刻主题便签档投影（notes.css 的两层外阴影，梦珑系列即用这套数值）：
           drop-shadow 不支持 spread / inset，故去掉 -2px spread 与 inset 白高光
           （inset 是矩形盒专属，正是透明切割式纸样顶部杂线的元凶）；
           沿 ::after 的 SVG alpha 轮廓生成，贴合圆角 / 双纸 / 票券。
           --deep-rgb 随明暗主题切换，fallback 为浅色值。 */
        filter:drop-shadow(0 4px 10px rgba(var(--deep-rgb,45,90,39),.12)) drop-shadow(0 1px 3px rgba(var(--deep-rgb,45,90,39),.09));
        background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNjQ3LjI2MiAyNTIuNTI5Ij4KICA8ZGVmcz4KICAgIDwvZGVmcz4KICA8ZyBpZD0icDIyNjk2LUFzc2V0XzExNyIgZGF0YS1uYW1lPSJBc3NldCAxMTciPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Ik0wIDI5LjY1MyBDMCAxMy4yNzYgMTMuMjc2IDAgMjkuNjUzIDAgTDQwMi42NTMgMCBDNDE3LjQ3NyAwIDQyOS43NiAxMC44NzcgNDMxLjk1NyAyNS4wODUgQzQzNC4xNTQgMTAuODc3IDQ0Ni40MzcgMCA0NjEuMjYgMCBMNjE3LjYwOCAwIEM2MzMuOTg1IDAgNjQ3LjI2MiAxMy4yNzYgNjQ3LjI2MiAyOS42NTMgTDY0Ny4yNjIgMjIyLjg3NSBDNjQ3LjI2MiAyMzkuMjUyIDYzMy45ODUgMjUyLjUyOSA2MTcuNjA4IDI1Mi41MjkgTDQ2MS4yNiAyNTIuNTI5IEM0NDYuNDM3IDI1Mi41MjkgNDM0LjE1NCAyNDEuNjUyIDQzMS45NTcgMjI3LjQ0NCBDNDI5Ljc2IDI0MS42NTIgNDE3LjQ3NyAyNTIuNTI5IDQwMi42NTMgMjUyLjUyOSBMMjkuNjUzIDI1Mi41MjkgQzEzLjI3NiAyNTIuNTI5IDAgMjM5LjI1MiAwIDIyMi44NzUgWiIgZmlsbD0iI2VjZWVlMSIvPgogICAgICA8cGF0aCBkPSJNMjkuNjUzIDEzLjk5IEw0MDIuNjUzIDEzLjk5IEM0MDYuNzA0IDEzLjk5IDQxMC4yMzIgMTUuNSA0MTIuODg5IDE3Ljc5NyBDNDE1LjU3NiAyMC4xMjEgNDE3LjUzOSAyMy4zOTkgNDE4LjEzIDI3LjIyMyBDNDE5LjE4NSAzNC4wNDMgNDI1LjA1NSAzOS4wNzUgNDMxLjk1NyAzOS4wNzUgQzQzOC44NTggMzkuMDc1IDQ0NC43MjggMzQuMDQzIDQ0NS43ODMgMjcuMjIzIEM0NDYuMzc0IDIzLjM5OSA0NDguMzM3IDIwLjEyMSA0NTEuMDI1IDE3Ljc5NyBDNDUzLjY4MSAxNS41IDQ1Ny4yMDkgMTMuOTkgNDYxLjI2IDEzLjk5IEw2MTcuNjA4IDEzLjk5IEM2MjYuMjYzIDEzLjk5IDYzMy4yNzEgMjAuOTk5IDYzMy4yNzEgMjkuNjUzIEw2MzMuMjcxIDIyMi44NzUgQzYzMy4yNzEgMjMxLjUzIDYyNi4yNjMgMjM4LjUzOCA2MTcuNjA4IDIzOC41MzggTDQ2MS4yNiAyMzguNTM4IEM0NTcuMjA5IDIzOC41MzggNDUzLjY4MSAyMzcuMDI5IDQ1MS4wMjUgMjM0LjczMiBDNDQ4LjMzNyAyMzIuNDA4IDQ0Ni4zNzQgMjI5LjEyOSA0NDUuNzgzIDIyNS4zMDYgQzQ0NC43MjggMjE4LjQ4NiA0MzguODU4IDIxMy40NTMgNDMxLjk1NyAyMTMuNDUzIEM0MjUuMDU1IDIxMy40NTMgNDE5LjE4NSAyMTguNDg2IDQxOC4xMyAyMjUuMzA2IEM0MTcuNTM5IDIyOS4xMjkgNDE1LjU3NiAyMzIuNDA4IDQxMi44ODkgMjM0LjczMiBDNDEwLjIzMiAyMzcuMDI5IDQwNi43MDQgMjM4LjUzOCA0MDIuNjUzIDIzOC41MzggTDI5LjY1MyAyMzguNTM4IEMyMC45OTkgMjM4LjUzOCAxMy45OSAyMzEuNTMgMTMuOTkgMjIyLjg3NSBMMTMuOTkgMjkuNjUzIEMxMy45OSAyMC45OTkgMjAuOTk5IDEzLjk5IDI5LjY1MyAxMy45OSBaIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmYmIwM2IiIHN0cm9rZS13aWR0aD0iMi4wOTkiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPgogICAgICA8Zz4KICAgICAgICA8cG9seWdvbiBwb2ludHM9IjUzOS44MzIsNDUuNSA1MjYuODQzLDQ0LjE2IDUxNi4yMjYsMjAyLjI5MiA1NjQuODgyLDE5Ni4zMTMiIGZpbGw9IiM0OTQ0NDEiLz4KICAgICAgICA8cGF0aCBkPSJNNTI3LjQ2MiAxOTIuMDg2IEw1MTYuNDMyIDIwMS45ODMgTDUzOC42NiAyMDQuNTc2IEM1NDguMTQ0IDIwNS42ODIgNTU3LjY1NiAyMDIuNzYgNTY0Ljg4MiAxOTYuNTE5IEw1NjQuODgyIDE5Ni41MTkgWiIgZmlsbD0iIzAwMDAwMCIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iNTI3LjA1LDQzLjY0NCA1MjcuMDUsMTkxLjU3MSA1NjQuODgyLDE5NS45MDEgNTY0Ljg4Miw0OS4xMDgiIGZpbGw9IiMyMTIwMWYiIHN0cm9rZT0iI2Y3OTMxZSIgc3Ryb2tlLXdpZHRoPSIwLjciIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iNTI2Ljg0MywxOTEuMzY1IDUxNi4wMTksMjAxLjc3NiA1MTYuMDE5LDYxLjM3NSA1MjYuODQzLDQ0LjE2IDUyNi44NDMsNDguMjk4IiBmaWxsPSIjMDAwMTAwIiBzdHJva2U9IiNmNzkzMWUiIHN0cm9rZS13aWR0aD0iMC43IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiLz4KICAgICAgICA8ZWxsaXBzZSBjeD0iNTUyLjA0OCIgY3k9IjIwOS45NzIiIHJ4PSIyNC43OTIiIHJ5PSI0LjQ4NCIgZmlsbD0iIzAwMDAwMCIvPgogICAgICAgIDxlbGxpcHNlIGN4PSI1MzMuNjk4IiBjeT0iMjEzLjIzMiIgcng9IjE2LjAzIiByeT0iMi44OTkiIGZpbGw9IiMwMDAwMDAiLz4KICAgICAgICA8ZWxsaXBzZSBjeD0iNTU1LjM0NiIgY3k9IjIxMy45NTMiIHJ4PSIxNi4wMyIgcnk9IjIuODk5IiBmaWxsPSIjMDAwMDAwIi8+CiAgICAgIDwvZz4KICAgICAgPGc+CiAgICAgICAgPHBhdGggZD0iTTQzMi42NTYgMzkuMTczIEw0MzIuNjU2IDQzLjUxIEM0MzIuNjU2IDQ0LjA4OSA0MzIuMTg2IDQ0LjU1OSA0MzEuNjA3IDQ0LjU1OSBDNDMxLjAyNyA0NC41NTkgNDMwLjU1OCA0NC4wODkgNDMwLjU1OCA0My41MSBMNDMwLjU1OCAzOS4xNzMgQzQzMC41NTggMzguNTk0IDQzMS4wMjcgMzguMTI0IDQzMS42MDcgMzguMTI0IEM0MzIuMTg2IDM4LjEyNCA0MzIuNjU2IDM4LjU5NCA0MzIuNjU2IDM5LjE3MyBNNDMyLjY1NiA1Mi4xODMgTDQzMi42NTYgNjAuODU2IEM0MzIuNjU2IDYxLjQzNSA0MzIuMTg2IDYxLjkwNSA0MzEuNjA3IDYxLjkwNSBDNDMxLjAyNyA2MS45MDUgNDMwLjU1OCA2MS40MzUgNDMwLjU1OCA2MC44NTYgTDQzMC41NTggNTIuMTgzIEM0MzAuNTU4IDUxLjYwMyA0MzEuMDI3IDUxLjEzNCA0MzEuNjA3IDUxLjEzNCBDNDMyLjE4NiA1MS4xMzQgNDMyLjY1NiA1MS42MDMgNDMyLjY1NiA1Mi4xODMgTTQzMi42NTYgNjkuNTI5IEw0MzIuNjU2IDc4LjIwMiBDNDMyLjY1NiA3OC43ODEgNDMyLjE4NiA3OS4yNTEgNDMxLjYwNyA3OS4yNTEgQzQzMS4wMjcgNzkuMjUxIDQzMC41NTggNzguNzgxIDQzMC41NTggNzguMjAyIEw0MzAuNTU4IDY5LjUyOSBDNDMwLjU1OCA2OC45NDkgNDMxLjAyNyA2OC40NzkgNDMxLjYwNyA2OC40NzkgQzQzMi4xODYgNjguNDc5IDQzMi42NTYgNjguOTQ5IDQzMi42NTYgNjkuNTI5IE00MzIuNjU2IDg2Ljg3NSBMNDMyLjY1NiA5NS41NDggQzQzMi42NTYgOTYuMTI3IDQzMi4xODYgOTYuNTk3IDQzMS42MDcgOTYuNTk3IEM0MzEuMDI3IDk2LjU5NyA0MzAuNTU4IDk2LjEyNyA0MzAuNTU4IDk1LjU0OCBMNDMwLjU1OCA4Ni44NzUgQzQzMC41NTggODYuMjk1IDQzMS4wMjcgODUuODI1IDQzMS42MDcgODUuODI1IEM0MzIuMTg2IDg1LjgyNSA0MzIuNjU2IDg2LjI5NSA0MzIuNjU2IDg2Ljg3NSBNNDMyLjY1NiAxMDQuMjIgTDQzMi42NTYgMTEyLjg5MyBDNDMyLjY1NiAxMTMuNDczIDQzMi4xODYgMTEzLjk0MyA0MzEuNjA3IDExMy45NDMgQzQzMS4wMjcgMTEzLjk0MyA0MzAuNTU4IDExMy40NzMgNDMwLjU1OCAxMTIuODkzIEw0MzAuNTU4IDEwNC4yMiBDNDMwLjU1OCAxMDMuNjQxIDQzMS4wMjcgMTAzLjE3MSA0MzEuNjA3IDEwMy4xNzEgQzQzMi4xODYgMTAzLjE3MSA0MzIuNjU2IDEwMy42NDEgNDMyLjY1NiAxMDQuMjIgTTQzMi42NTYgMTIxLjU2NiBMNDMyLjY1NiAxMzAuMjM5IEM0MzIuNjU2IDEzMC44MTkgNDMyLjE4NiAxMzEuMjg5IDQzMS42MDcgMTMxLjI4OSBDNDMxLjAyNyAxMzEuMjg5IDQzMC41NTggMTMwLjgxOSA0MzAuNTU4IDEzMC4yMzkgTDQzMC41NTggMTIxLjU2NiBDNDMwLjU1OCAxMjAuOTg3IDQzMS4wMjcgMTIwLjUxNyA0MzEuNjA3IDEyMC41MTcgQzQzMi4xODYgMTIwLjUxNyA0MzIuNjU2IDEyMC45ODcgNDMyLjY1NiAxMjEuNTY2IE00MzIuNjU2IDEzOC45MTIgTDQzMi42NTYgMTQ3LjU4NSBDNDMyLjY1NiAxNDguMTY1IDQzMi4xODYgMTQ4LjYzNSA0MzEuNjA3IDE0OC42MzUgQzQzMS4wMjcgMTQ4LjYzNSA0MzAuNTU4IDE0OC4xNjUgNDMwLjU1OCAxNDcuNTg1IEw0MzAuNTU4IDEzOC45MTIgQzQzMC41NTggMTM4LjMzMyA0MzEuMDI3IDEzNy44NjMgNDMxLjYwNyAxMzcuODYzIEM0MzIuMTg2IDEzNy44NjMgNDMyLjY1NiAxMzguMzMzIDQzMi42NTYgMTM4LjkxMiBNNDMyLjY1NiAxNTYuMjU4IEw0MzIuNjU2IDE2NC45MzEgQzQzMi42NTYgMTY1LjUxMSA0MzIuMTg2IDE2NS45OCA0MzEuNjA3IDE2NS45OCBDNDMxLjAyNyAxNjUuOTggNDMwLjU1OCAxNjUuNTExIDQzMC41NTggMTY0LjkzMSBMNDMwLjU1OCAxNTYuMjU4IEM0MzAuNTU4IDE1NS42NzkgNDMxLjAyNyAxNTUuMjA5IDQzMS42MDcgMTU1LjIwOSBDNDMyLjE4NiAxNTUuMjA5IDQzMi42NTYgMTU1LjY3OSA0MzIuNjU2IDE1Ni4yNTggTTQzMi42NTYgMTczLjYwNCBMNDMyLjY1NiAxODIuMjc3IEM0MzIuNjU2IDE4Mi44NTcgNDMyLjE4NiAxODMuMzI2IDQzMS42MDcgMTgzLjMyNiBDNDMxLjAyNyAxODMuMzI2IDQzMC41NTggMTgyLjg1NyA0MzAuNTU4IDE4Mi4yNzcgTDQzMC41NTggMTczLjYwNCBDNDMwLjU1OCAxNzMuMDI1IDQzMS4wMjcgMTcyLjU1NSA0MzEuNjA3IDE3Mi41NTUgQzQzMi4xODYgMTcyLjU1NSA0MzIuNjU2IDE3My4wMjUgNDMyLjY1NiAxNzMuNjA0IE00MzIuNjU2IDE5MC45NSBMNDMyLjY1NiAxOTkuNjIzIEM0MzIuNjU2IDIwMC4yMDIgNDMyLjE4NiAyMDAuNjcyIDQzMS42MDcgMjAwLjY3MiBDNDMxLjAyNyAyMDAuNjcyIDQzMC41NTggMjAwLjIwMiA0MzAuNTU4IDE5OS42MjMgTDQzMC41NTggMTkwLjk1IEM0MzAuNTU4IDE5MC4zNyA0MzEuMDI3IDE4OS45MDEgNDMxLjYwNyAxODkuOTAxIEM0MzIuMTg2IDE4OS45MDEgNDMyLjY1NiAxOTAuMzcgNDMyLjY1NiAxOTAuOTUgTTQzMi42NTYgMjA4LjI5NiBMNDMyLjY1NiAyMTIuNjMyIEM0MzIuNjU2IDIxMy4yMTIgNDMyLjE4NiAyMTMuNjgyIDQzMS42MDcgMjEzLjY4MiBDNDMxLjAyNyAyMTMuNjgyIDQzMC41NTggMjEzLjIxMiA0MzAuNTU4IDIxMi42MzIgTDQzMC41NTggMjA4LjI5NiBDNDMwLjU1OCAyMDcuNzE2IDQzMS4wMjcgMjA3LjI0NyA0MzEuNjA3IDIwNy4yNDcgQzQzMi4xODYgMjA3LjI0NyA0MzIuNjU2IDIwNy43MTYgNDMyLjY1NiAyMDguMjk2IiBmaWxsPSIjZmJiMDNiIi8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  // paper 用：返回贴纸 DOM（本模板用 preview 作占位，按需改为 render() 自有结构）
  render() {
    return `<div class="bm-sticker-墨"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_墨 = material;
