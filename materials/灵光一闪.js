// 文件名: 灵光一闪.js  →  全局变量: __bamboo_material_灵光一闪
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利
// 系列：生活渐变（纯矢量导出：渐变以 SVG linearGradient 承载，无内嵌位图）

const material = {
  type: 'paper',
  name: '灵光一闪',

  preview:
    `<svg width="100%" height="100%" viewBox="0 0 312 401" xmlns="http://www.w3.org/2000/svg"><rect x="46" y="14" width="254" height="374" rx="18" fill="#fffef5" stroke="#fbb03b" stroke-width="3"/><rect x="8" y="26" width="40" height="146" rx="10" fill="#fbb03b"/><text x="30" y="78" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">灵</text><text x="30" y="108" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">光</text><text x="30" y="138" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">一</text><text x="30" y="168" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">闪</text></svg>`,

  css() {
    return `
      .tw-card[data-paper="灵光一闪"]{
        background:transparent;
        box-shadow:none;
        border:none;
        aspect-ratio: 311.662 / 400.659;
        --rice-paper:transparent;
        --ink-dark:#2b2b2b;
        --ink-pale:#8c857c;
        --tw-rule-rgb:140,133,124;
        --edge-distort:0;
        --noise:0;
      }
      .tw-card[data-paper="灵光一闪"] .tw-card-edge,
      .tw-card[data-paper="灵光一闪"] .tw-card-noise{display:none;}
      .tw-card[data-paper="灵光一闪"] .tw-card-main{
        background:transparent; color:#2b2b2b; position:relative; height:100%; padding:0; display:block;
      }
      .tw-card[data-paper="灵光一闪"] .tw-card-title{ visibility:hidden; }
      .tw-card[data-paper="灵光一闪"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      .tw-card[data-paper="灵光一闪"] .tw-card-text{
        position:absolute; top:6%; left:17%; right:7%; bottom:6%;
        color:#2b2b2b; text-align:left; z-index:2; overflow:auto;
      }
      .tw-card[data-paper="灵光一闪"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="灵光一闪"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="灵光一闪"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="灵光一闪"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      .tw-card[data-paper="灵光一闪"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzExLjY2MiA0MDAuNjU5Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xe2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQtMSl9CiAgICAgIC5jbHMtMntmaWxsOiNmYmIwM2J9CiAgICAgIC5jbHMtM3tmaWxsOiNmZmZmZmZ9CiAgICAgIC5jbHMtNHtmaWxsOm5vbmU7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kfQogICAgICAuY2xzLTV7ZmlsbDojZmZmZWY1O3N0cm9rZTojZmZmZmZmO3N0cm9rZS1taXRlcmxpbWl0OjEwfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50LTEiIHgxPSIxNjcuNTc3IiB5MT0iMCIgeDI9IjE2Ny41NzciIHkyPSI0MDAuNjU5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZlZWNjZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYmIwM2IiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDx0aXRsZT5Bc3NldCA5NTwvdGl0bGU+CiAgPGcgaWQ9IkFzc2V0Xzk1IiBkYXRhLW5hbWU9IkFzc2V0IDk1Ij4KICAgIDxnPgogICAgICA8cGF0aCBkPSJNNTQuMTcxIDAgTDI4MC45ODMgMCBDMjk3LjkyNiAwIDMxMS42NjIgMTMuNzM1IDMxMS42NjIgMzAuNjc5IEwzMTEuNjYyIDM2OS45OCBDMzExLjY2MiAzODYuOTIzIDI5Ny45MjYgNDAwLjY1OSAyODAuOTgzIDQwMC42NTkgTDU0LjE3MSA0MDAuNjU5IEMzNy4yMjggNDAwLjY1OSAyMy40OTIgMzg2LjkyMyAyMy40OTIgMzY5Ljk4IEwyMy40OTIgMzAuNjc5IEMyMy40OTIgMTMuNzM1IDM3LjIyOCAwIDU0LjE3MSAwIFoiIGNsYXNzPSJjbHMtMSIvPgogICAgICA8cGF0aCBkPSJNMCAxNDAuMzQzIEwwIDM2Ljk5NSBDMCAzMy42ODEgMi42ODYgMzAuOTk1IDYgMzAuOTk1IEwzOC44MzIgMzAuOTk1IEwzOC44MzIgMTQ2LjM0MyBMNiAxNDYuMzQzIEMyLjY4NiAxNDYuMzQzIDAgMTQzLjY1NiAwIDE0MC4zNDMgWiIgY2xhc3M9ImNscy0yIi8+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGQ9Ik0xNC4zMzIgNjkuNzkxIEwxNC4zMzIgNzEuMiBMMjMuMTY5IDcxLjIgTDIzLjE2OSA3Mi4yMTQgTDEzLjY1MSA3Mi4yMTQgTDEzLjY1MSA3My43MDIgTDI0LjgxNiA3My43MDIgTDI0LjgxNiA2Ny4yNTcgTDEzLjkwNSA2Ny4yNTcgTDEzLjkwNSA2OC43NDUgTDIzLjE2OSA2OC43NDUgTDIzLjE2OSA2OS43OTEgWiBNMTUuMzc3IDc0LjU0MiBDMTQuOTAyIDc1LjYxOSAxNC4zNDggNzYuNTM3IDEzLjY4MyA3Ny4zMTMgTDE0Ljk4MiA3OC4yNDcgQzE1LjY3OCA3Ny40MDggMTYuMjggNzYuNDEgMTYuODAzIDc1LjIzOCBaIE0yMC4zMDMgNzQuMDAzIEwxOC42NTYgNzQuMDAzIEMxOC42NCA3NC45MDYgMTguNTYxIDc1LjYwMyAxOC40MDIgNzYuMTA5IEMxNy43NjkgNzcuOTE1IDE1LjgwNSA3OS4xOTggMTIuNTExIDc5Ljk1OCBMMTMuMTkyIDgxLjQ5NCBDMTYuMzU5IDgwLjY1NSAxOC40NjYgNzkuMzcyIDE5LjUxMSA3Ny42NjEgQzIwLjUyNCA3OS40MzUgMjIuNzU3IDgwLjcxOCAyNi4xNzggODEuNDk0IEwyNi44NTkgNzkuOTU4IEMyMy4zMjggNzkuMjYxIDIxLjA5NSA3Ny44ODMgMjAuMTYgNzUuODI0IEMyMC4yNTUgNzUuMjg2IDIwLjMwMyA3NC42NjggMjAuMzAzIDc0LjAwMyBaIE0yMy45NDUgNzQuNDYyIEMyMy40MjMgNzUuNTA4IDIyLjgwNSA3Ni4zOTUgMjIuMDkyIDc3LjEyMyBMMjMuNDA3IDc4LjA3MyBDMjQuMTY3IDc3LjI1IDI0LjgxNiA3Ni4yODQgMjUuMzg2IDc1LjE1OSBaIiBjbGFzcz0iY2xzLTMiLz4KICAgICAgICA8cGF0aCBkPSJNMTguNTc3IDgyLjY4MiBMMTguNTc3IDg4LjMwNCBMMTIuNDQ4IDg4LjMwNCBMMTIuNDQ4IDg5LjkxOSBMMTYuNTAyIDg5LjkxOSBMMTYuNTAyIDg5LjkzNSBDMTYuNDM5IDkxLjQ1NSAxNi4xMjIgOTIuNjc1IDE1LjUyIDkzLjYwOSBDMTQuOTE4IDk0LjQ4IDEzLjc2MiA5NS4yMDkgMTIuMDUyIDk1LjgxIEwxMi45ODYgOTcuMjgzIEMxNC43NiA5Ni42ODEgMTYuMDQzIDk1LjgyNiAxNi44MzQgOTQuNzE4IEMxNy42NTggOTMuNTE0IDE4LjEwMSA5MS45MTUgMTguMTgxIDg5LjkzNSBMMTguMTgxIDg5LjkxOSBMMjAuNDE0IDg5LjkxOSBMMjAuNDE0IDk1LjAxOSBDMjAuNDE0IDk2LjI1NCAyMC45ODQgOTYuODg3IDIyLjEyNCA5Ni44ODcgTDI0LjY0MiA5Ni44ODcgQzI1LjI3NSA5Ni44ODcgMjUuNzM1IDk2LjcyOSAyNi4wNTEgOTYuNDEyIEMyNi4zNjggOTYuMDggMjYuNTkgOTUuMDM0IDI2LjczMiA5My4yOTIgTDI1LjExNyA5Mi43ODYgQzI1LjA1NCA5NC4wMjEgMjQuOTc1IDk0Ljc0OSAyNC44NDggOTUuMDAzIEMyNC43MzcgOTUuMjI0IDI0LjU2MyA5NS4zNTEgMjQuMzQxIDk1LjM1MSBMMjIuNjE1IDk1LjM1MSBDMjIuMjUxIDk1LjM1MSAyMi4wNzYgOTUuMTE0IDIyLjA3NiA5NC42NyBMMjIuMDc2IDg5LjkxOSBMMjYuNCA4OS45MTkgTDI2LjQgODguMzA0IEwyMC4yNTUgODguMzA0IEwyMC4yNTUgODIuNjgyIFogTTIzLjgwMyA4My4zNzkgQzIzLjI5NiA4NC41OTggMjIuNjMxIDg1LjgzMyAyMS43OTEgODcuMDY5IEwyMy4zMTIgODcuODYgQzI0LjE1MSA4Ni42NTcgMjQuODMyIDg1LjQyMiAyNS4zNTUgODQuMTIzIFogTTE1LjA5MiA4My41MzcgTDEzLjUyNSA4NC4yODEgQzE0LjI2OSA4NS4zMjYgMTQuOTY2IDg2LjUzIDE1LjYxNSA4Ny44NiBMMTcuMTgzIDg3LjA2OSBDMTYuNTE4IDg1Ljc4NiAxNS44MjEgODQuNjE0IDE1LjA5MiA4My41MzcgWiIgY2xhc3M9ImNscy0zIi8+CiAgICAgICAgPHBhdGggZD0iTTEyLjIxIDEwNC44MzcgTDEyLjIxIDEwNi40ODQgTDI2LjYwNiAxMDYuNDg0IEwyNi42MDYgMTA0LjgzNyBaIiBjbGFzcz0iY2xzLTMiLz4KICAgICAgICA8cGF0aCBkPSJNMTIuODEyIDExNi45MzcgTDEyLjgxMiAxMjguOTczIEwxNC40MjcgMTI4Ljk3MyBMMTQuNDI3IDExNi45MzcgWiBNMjQuMTY3IDEyOC44MyBDMjUuMzcxIDEyOC44MyAyNS45ODggMTI4LjE5NyAyNS45ODggMTI2Ljk0NiBMMjUuOTg4IDExNC45NTcgTDE4LjQ4MiAxMTQuOTU3IEwxOC40ODIgMTE2LjQ3NyBMMjQuMzczIDExNi40NzcgTDI0LjM3MyAxMjYuNDg2IEMyNC4zNzMgMTI3LjA0MSAyNC4xODMgMTI3LjMyNiAyMy44MTggMTI3LjMyNiBMMjIuMzkzIDEyNy4yNzggTDIyLjgzNyAxMjguODMgWiBNMTkuMTQ3IDEyMi41NDMgQzIwLjQ2MSAxMjMuODQyIDIxLjUyMiAxMjUuMDkzIDIyLjMxNCAxMjYuMjk2IEwyMy41OTcgMTI0Ljk5OCBDMjIuNTIgMTIzLjY2NyAyMS4yMjEgMTIyLjMyMSAxOS42NjkgMTIwLjk1OSBDMTkuOTA3IDEyMC4wNTcgMjAuMTEzIDExOS4wMTEgMjAuMjg3IDExNy44MjQgTDE4LjU0NSAxMTcuODI0IEMxOC4yOTEgMTE5LjcyNCAxNy44OTYgMTIxLjI0NCAxNy4zNTcgMTIyLjM1MyBDMTYuNzg3IDEyMy4zOTggMTUuOTYzIDEyNC4zMzIgMTQuODcxIDEyNS4xNzIgTDE1LjkxNiAxMjYuNTAyIEMxNy4yMyAxMjUuNDg5IDE4LjIyOCAxMjQuMzY0IDE4Ljg5MyAxMjMuMTEzIEMxOC45NzIgMTIyLjkyMyAxOS4wNTIgMTIyLjczMyAxOS4xNDcgMTIyLjU0MyBaIE0xNS42MTUgMTE0LjEzNCBMMTQuMTExIDExNC44MTUgQzE0LjgwNyAxMTUuNjU0IDE1LjQ1NyAxMTYuNjIgMTYuMDQzIDExNy43MjkgTDE3LjUzMSAxMTYuOTUzIEMxNi45NzcgMTE1LjkzOSAxNi4zNDQgMTE0Ljk4OSAxNS42MTUgMTE0LjEzNCBaIiBjbGFzcz0iY2xzLTMiLz4KICAgICAgPC9nPgogICAgICA8cGF0aCBkPSJNMjMuNDU5IDYwLjg5MSBDMjMuNzI4IDU5LjU0NCAyNC40MDIgNTguNiAyNS40OCA1Ny41MjIgQzI2LjgyOCA1Ni4zMDkgMjcuNTAyIDU0LjU1NyAyNy41MDIgNTIuODA2IEMyNy41MDIgNDguMzQgMjMuODgyIDQ0LjcyIDE5LjQxNiA0NC43MiBDMTQuOTUgNDQuNzIgMTEuMzMgNDguMzQgMTEuMzMgNTIuODA2IEMxMS4zMyA1NC4xNTMgMTEuNTk5IDU1Ljc3IDEzLjM1MSA1Ny41MjIgQzE0LjI5NSA1OC40NjYgMTUuMTAzIDU5LjU0NCAxNS4zNzMgNjAuODkxIiBjbGFzcz0iY2xzLTQiLz4KICAgICAgPHBhdGggZD0iTTU0LjE3MSAxNS4zMzkgTDI4MC45ODMgMTUuMzM5IEMyODkuNDYgMTUuMzM5IDI5Ni4zMjIgMjIuMjAyIDI5Ni4zMjIgMzAuNjc5IEwyOTYuMzIyIDM2OS45OCBDMjk2LjMyMiAzNzguNDU3IDI4OS40NiAzODUuMzE5IDI4MC45ODMgMzg1LjMxOSBMNTQuMTcxIDM4NS4zMTkgQzQ1LjY5NCAzODUuMzE5IDM4LjgzMiAzNzguNDU3IDM4LjgzMiAzNjkuOTggTDM4LjgzMiAzMC42NzkgQzM4LjgzMiAyMi4yMDIgNDUuNjk0IDE1LjMzOSA1NC4xNzEgMTUuMzM5IFoiIGNsYXNzPSJjbHMtNSIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  render() {
    return `<div class="bm-sticker-灵光一闪"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_灵光一闪 = material;
