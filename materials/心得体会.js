// 文件名: 心得体会.js  →  全局变量: __bamboo_material_心得体会
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利
// 系列：生活渐变（纯矢量导出：渐变以 SVG linearGradient 承载，无内嵌位图）
// 文字区已内收：白区边界约 left13%/right5%/top3%/bottom4%，文字区留 8%/20%/9%/8%，
// 左侧多留 7%（相对白区左缘）以拉开与竖排标签的距离。

const material = {
  type: 'paper',
  name: '心得体会',

  preview:
    `<svg width="100%" height="100%" viewBox="0 0 312 401" xmlns="http://www.w3.org/2000/svg"><rect x="46" y="14" width="254" height="374" rx="18" fill="#fffef5" stroke="#8cc63f" stroke-width="3"/><rect x="8" y="26" width="40" height="146" rx="10" fill="#8cc63f"/><text x="30" y="78" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">心</text><text x="30" y="108" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">得</text><text x="30" y="138" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">体</text><text x="30" y="168" font-size="19" fill="#ffffff" font-family="sans-serif" text-anchor="middle">会</text></svg>`,

  css() {
    return `
      .tw-card[data-paper="心得体会"]{
        background:transparent;
        box-shadow:none;
        border:none;
        aspect-ratio: 311.662 / 400.659;
        --rice-paper:transparent;
        --ink-dark:#2f3a20;
        --ink-pale:#7d8a6a;
        --tw-rule-rgb:140,133,124;
        --edge-distort:0;
        --noise:0;
      }
      .tw-card[data-paper="心得体会"] .tw-card-edge,
      .tw-card[data-paper="心得体会"] .tw-card-noise{display:none;}
      .tw-card[data-paper="心得体会"] .tw-card-main{
        background:transparent; color:#2f3a20; position:relative; height:100%; padding:0; display:block;
      }
      .tw-card[data-paper="心得体会"] .tw-card-title{ visibility:hidden; }
      .tw-card[data-paper="心得体会"] .tw-card-head{
        position:absolute; inset:0; border:none; padding:0; margin:0; z-index:1;
      }
      .tw-card[data-paper="心得体会"] .tw-card-text{
        position:absolute; top:8%; left:20%; right:9%; bottom:8%;
        color:#2f3a20; text-align:left; z-index:2; overflow:auto;
      }
      .tw-card[data-paper="心得体会"] .tw-card-text::-webkit-scrollbar{width:3px;height:3px;}
      .tw-card[data-paper="心得体会"] .tw-card-text::-webkit-scrollbar-track{background:transparent;}
      .tw-card[data-paper="心得体会"] .tw-card-text::-webkit-scrollbar-thumb{background:transparent;border-radius:2px;}
      .tw-card[data-paper="心得体会"]:hover .tw-card-text::-webkit-scrollbar-thumb{background:rgba(35,24,21,0.12);}
      .tw-card[data-paper="心得体会"] .tw-card-main::after{
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzExLjY2MiA0MDAuNjU5Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xe2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQtMSl9CiAgICAgIC5jbHMtMntmaWxsOiM4Y2M2M2Z9CiAgICAgIC5jbHMtM3tmaWxsOiNmZmZmZmZ9CiAgICAgIC5jbHMtNHtmaWxsOm5vbmU7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kfQogICAgICAuY2xzLTV7ZmlsbDojZmFmZmY3O3N0cm9rZTojZmZmZmZmO3N0cm9rZS1taXRlcmxpbWl0OjEwfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50LTEiIHgxPSIxNjcuNTc3IiB5MT0iMCIgeDI9IjE2Ny41NzciIHkyPSI0MDAuNjU5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2U1ZjJkNCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Y2M2M2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDx0aXRsZT5Bc3NldCA5MjwvdGl0bGU+CiAgPGcgaWQ9IkFzc2V0XzkyIiBkYXRhLW5hbWU9IkFzc2V0IDkyIj4KICAgIDxnPgogICAgICA8cGF0aCBkPSJNNTQuMTcxIDAgTDI4MC45ODMgMCBDMjk3LjkyNiAwIDMxMS42NjIgMTMuNzM1IDMxMS42NjIgMzAuNjc5IEwzMTEuNjYyIDM2OS45OCBDMzExLjY2MiAzODYuOTIzIDI5Ny45MjYgNDAwLjY1OSAyODAuOTgzIDQwMC42NTkgTDU0LjE3MSA0MDAuNjU5IEMzNy4yMjggNDAwLjY1OSAyMy40OTIgMzg2LjkyMyAyMy40OTIgMzY5Ljk4IEwyMy40OTIgMzAuNjc5IEMyMy40OTIgMTMuNzM1IDM3LjIyOCAwIDU0LjE3MSAwIFoiIGNsYXNzPSJjbHMtMSIvPgogICAgICA8cGF0aCBkPSJNMCAxMzguMzQzIEwwIDM4Ljk5NSBDMCAzNC41NzcgMy41ODIgMzAuOTk1IDggMzAuOTk1IEwzOC44MzIgMzAuOTk1IEwzOC44MzIgMTQ2LjM0MyBMOCAxNDYuMzQzIEMzLjU4MiAxNDYuMzQzIDAgMTQyLjc2MSAwIDEzOC4zNDMgWiIgY2xhc3M9ImNscy0yIi8+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGQ9Ik0yMS41MzggODAuOTQgQzIyLjIwMyA4MC45NCAyMi42OTQgODAuNzM0IDIzLjAxMSA4MC4zMjIgQzIzLjM1OSA3OS44OTQgMjMuNTk3IDc4LjU0OCAyMy43MjMgNzYuMjg0IEwyMi4xNTYgNzUuNzYxIEMyMi4wOTIgNzcuNDg3IDIxLjk5NyA3OC41MTcgMjEuODM5IDc4Ljg0OSBDMjEuNzEyIDc5LjE2NiAyMS41MDYgNzkuMzI0IDIxLjIyMSA3OS4zMjQgTDE4LjUyOSA3OS4zMjQgQzE4LjAwNiA3OS4zMjQgMTcuNzUzIDc5LjEwMyAxNy43NTMgNzguNjU5IEwxNy43NTMgNzAuMTA3IEwxNi4wOSA3MC4xMDcgTDE2LjA5IDc5LjAyMyBDMTYuMDkgODAuMjkgMTYuNzI0IDgwLjk0IDE4LjAyMiA4MC45NCBaIE0xMy42NjcgNzEuNjI4IEMxMy4zNSA3NC4wMzUgMTIuNzk2IDc2LjMxNSAxMi4wMiA3OC40NjkgTDEzLjQ2MSA3OS4zNzIgQzE0LjIzNyA3Ny4yOTcgMTQuODM5IDc0LjgyNyAxNS4yNjcgNzEuOTYgWiBNMjQuNDg0IDcxLjIzMiBMMjIuOSA3MS43NTQgQzIzLjc4NyA3My43ODEgMjQuNjEgNzYuMTA5IDI1LjMzOSA3OC43NyBMMjYuODU5IDc4LjA3MyBDMjYuMTc4IDc1LjY1IDI1LjM4NiA3My4zNyAyNC40ODQgNzEuMjMyIFogTTE4Ljg5MyA2Ni43MTggTDE3LjUzMSA2Ny41NzMgQzE4Ljg0NiA2OS4xNTcgMTkuODkxIDcwLjYxNCAyMC42ODMgNzEuOTI5IEwyMi4wNjEgNzAuOTc4IEMyMS4zMzIgNjkuNzU5IDIwLjI3MSA2OC4zMzQgMTguODkzIDY2LjcxOCBaIiBjbGFzcz0iY2xzLTMiLz4KICAgICAgICA8cGF0aCBkPSJNMTQuMDYzIDkxLjEwNyBMMTQuMDYzIDk3LjMxNSBMMTUuNjYzIDk3LjMxNSBMMTUuNjYzIDg5LjQyOCBDMTYuMjAxIDg4Ljc2MyAxNi42NDQgODguMDUgMTYuOTkzIDg3LjI5IEwxNS41NjggODYuNjI1IEMxNC44MDcgODguMTc3IDEzLjY1MSA4OS41MzkgMTIuMDgzIDkwLjcxMSBMMTIuNTc0IDkyLjI3OSBDMTMuMDk3IDkxLjg5OSAxMy41ODggOTEuNTE5IDE0LjA2MyA5MS4xMDcgWiBNMTUuNTIgODIuNTg3IEMxNC43NiA4NC4wMTIgMTMuNTg4IDg1LjI2MyAxMi4wMDQgODYuMzI0IEwxMi41MTEgODcuOTI0IEMxNC41ODYgODYuNTMgMTYuMDQzIDg0Ljk2MiAxNi44OTggODMuMjUyIFogTTE3LjcwNiA4My4xMDkgTDE3LjcwNiA4OC40NjIgTDI1LjQ5NyA4OC40NjIgTDI1LjQ5NyA4My4xMDkgWiBNMjMuOTE0IDg3LjE2NCBMMTkuMjczIDg3LjE2NCBMMTkuMjczIDg2LjM4OCBMMjMuOTE0IDg2LjM4OCBaIE0xOS4yNzMgODUuMTY4IEwxOS4yNzMgODQuNDA4IEwyMy45MTQgODQuNDA4IEwyMy45MTQgODUuMTY4IFogTTE3LjA4OCA4OS4yODYgTDE3LjA4OCA5MC43MTEgTDIyLjk2MyA5MC43MTEgTDIyLjk2MyA5MS41ODIgTDE2LjUxOCA5MS41ODIgTDE2LjUxOCA5My4wMjMgTDIyLjk2MyA5My4wMjMgTDIyLjk2MyA5NS4yNTYgQzIyLjk2MyA5NS41NzMgMjIuNzczIDk1Ljc0NyAyMi40MDkgOTUuNzQ3IEMyMS45MzQgOTUuNzQ3IDIxLjQ0MyA5NS43IDIwLjkwNSA5NS42MzYgTDIxLjI1MyA5Ny4xODggTDIyLjk3OSA5Ny4xODggQzI0LjA1NiA5Ny4xODggMjQuNTk1IDk2LjY2NiAyNC41OTUgOTUuNjUyIEwyNC41OTUgOTMuMDIzIEwyNi43MTcgOTMuMDIzIEwyNi43MTcgOTEuNTgyIEwyNC41OTUgOTEuNTgyIEwyNC41OTUgOTAuNzExIEwyNi4zNTIgOTAuNzExIEwyNi4zNTIgODkuMjg2IFogTTE5LjA2NyA5My4xNjYgTDE3Ljg4IDk0LjAyMSBDMTguNjcyIDk0Ljg2IDE5LjMwNSA5NS42MiAxOS43NjQgOTYuMzE3IEwyMS4wMTUgOTUuNDYyIEMyMC41NzIgOTQuNzk3IDE5LjkyMyA5NC4wMjEgMTkuMDY3IDkzLjE2NiBaIiBjbGFzcz0iY2xzLTMiLz4KICAgICAgICA8cGF0aCBkPSJNMTMuNzk0IDEwNS4yNjUgTDEzLjc5NCAxMTMuMTM2IEwxNS40MjUgMTEzLjEzNiBMMTUuNDI1IDEwMi42OTkgQzE2LjAyNyAxMDEuNTQzIDE2LjUzNCAxMDAuMzQgMTYuOTE0IDk5LjA3MyBMMTUuNDI1IDk4LjM3NiBDMTQuNjk3IDEwMC45NzMgMTMuNTU2IDEwMy4yMjIgMTIuMDM2IDEwNS4xNTQgTDEyLjU0MyAxMDYuODAxIEMxMi45ODYgMTA2LjI5NCAxMy4zOTggMTA1Ljc4OCAxMy43OTQgMTA1LjI2NSBaIE0xNi40NyAxMDAuOTQyIEwxNi40NyAxMDIuNTI1IEwxOS4xNDcgMTAyLjUyNSBDMTguNDAyIDEwNS4xODYgMTcuMjQ2IDEwNy4zODcgMTUuNjYzIDEwOS4xMTMgTDE2LjUxOCAxMTAuNTM5IEMxOC4yOTEgMTA4LjUxMiAxOS41OSAxMDUuOTQ2IDIwLjM4MiAxMDIuODI2IEwyMC4zODIgMTA4LjQ2NCBMMTguMjYgMTA4LjQ2NCBMMTguMjYgMTEwLjA0OCBMMjAuMzgyIDExMC4wNDggTDIwLjM4MiAxMTMuMTM2IEwyMi4wMTMgMTEzLjEzNiBMMjIuMDEzIDExMC4wNDggTDI0LjE5OSAxMTAuMDQ4IEwyNC4xOTkgMTA4LjQ2NCBMMjIuMDEzIDEwOC40NjQgTDIyLjAxMyAxMDIuODEgQzIyLjcyNiAxMDUuNTgyIDIzLjk2MSAxMDguMSAyNS43MDMgMTEwLjM0OSBMMjYuNzggMTA4Ljk4NyBDMjUuMTE3IDEwNy4wODYgMjMuOTI5IDEwNC45MzIgMjMuMjMzIDEwMi41MjUgTDI2LjE0NyAxMDIuNTI1IEwyNi4xNDcgMTAwLjk0MiBMMjIuMDEzIDEwMC45NDIgTDIyLjAxMyA5OC40MzkgTDIwLjM4MiA5OC40MzkgTDIwLjM4MiAxMDAuOTQyIFoiIGNsYXNzPSJjbHMtMyIvPgogICAgICAgIDxwYXRoIGQ9Ik0xOC44MTQgMTE0LjI2IEMxNi45NzcgMTE2LjMxOSAxNC42ODEgMTE4LjAyOSAxMS45MDkgMTE5LjM5MSBMMTIuNzk2IDEyMS4wMDcgQzEzLjc0NiAxMjAuNDg0IDE0LjY0OSAxMTkuOTMgMTUuNDg4IDExOS4zNDQgTDE1LjQ4OCAxMjAuNTQ3IEwyMy4zOTEgMTIwLjU0NyBMMjMuMzkxIDExOS40MDcgQzI0LjE5OSAxMTkuOTc3IDI1LjA1NCAxMjAuNTE2IDI1Ljk3MiAxMjAuOTkxIEwyNi44NzUgMTE5LjM3NiBDMjQuMjc4IDExOC4xNCAyMS45OTcgMTE2LjQzIDIwLjAxOCAxMTQuMjYgWiBNMTUuOTYzIDExOC45OTUgQzE3LjI5NCAxMTguMDE0IDE4LjQzNCAxMTYuOTIxIDE5LjQxNiAxMTUuNzQ5IEMyMC40MTQgMTE2Ljk1MyAyMS41NTQgMTE4LjAyOSAyMi44NTIgMTE4Ljk5NSBaIE0xMy4wMDIgMTIyLjE2MyBMMTMuMDAyIDEyMy43NzggTDE2LjU4MSAxMjMuNzc4IEMxNi4wMjcgMTI0Ljc5MiAxNS4zNjIgMTI1Ljc3NCAxNC41NyAxMjYuNzA4IEMxNC4zOTYgMTI2Ljg5OCAxNC4xMTEgMTI3LjA1NiAxMy43MTUgMTI3LjE1MSBMMTQuMTU4IDEyOC41OTMgQzE3LjgzMiAxMjguMzcxIDIwLjg4OSAxMjguMDcgMjMuMzQzIDEyNy42OSBDMjMuNjQ0IDEyOC4xMDIgMjMuOTI5IDEyOC41MjkgMjQuMTk5IDEyOC45NDEgTDI1LjU3NiAxMjcuOTc1IEMyNC43ODUgMTI2LjgzNSAyMy42NzYgMTI1LjQ3MyAyMi4yMzUgMTIzLjkyMSBMMjAuOTUyIDEyNC43MjggQzIxLjQ3NSAxMjUuMzMgMjEuOTY2IDEyNS45MTYgMjIuNDI1IDEyNi40ODYgQzIwLjM5OCAxMjYuNzI0IDE4LjMwNyAxMjYuODk4IDE2LjE2OSAxMjcuMDI1IEMxNy4wNTYgMTI2LjEwNiAxNy44MzIgMTI1LjAxMyAxOC40OTcgMTIzLjc3OCBMMjUuODYxIDEyMy43NzggTDI1Ljg2MSAxMjIuMTYzIFoiIGNsYXNzPSJjbHMtMyIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGQ9Ik0xMi4wNTEgNTMuMDI5IEMxMC44IDUxLjcyNSAxMC4zNjcgNDkuODQgMTAuOTIyIDQ4LjEyMSBDMTEuNDc3IDQ2LjQwMiAxMi45MzIgNDUuMTI2IDE0LjcwOSA0NC44IEMxNi40ODYgNDQuNDc0IDE4LjI5OCA0NS4xNSAxOS40MjcgNDYuNTYgQzIwLjU2MiA0NS4xNjUgMjIuMzY4IDQ0LjUwMiAyNC4xMzYgNDQuODMxIEMyNS45MDQgNDUuMTYxIDI3LjM1IDQ2LjQzIDI3LjkwNyA0OC4xNCBDMjguNDYzIDQ5Ljg1IDI4LjA0IDUxLjcyNyAyNi44MDQgNTMuMDMzIEwyMS4wNzMgNTkuMjY2IEMyMC42NTkgNTkuNzQzIDIwLjA1OSA2MC4wMTYgMTkuNDI4IDYwLjAxNiBDMTguNzk4IDYwLjAxNiAxOC4xOTggNTkuNzQzIDE3Ljc4NCA1OS4yNjYgWiIgY2xhc3M9ImNscy00Ii8+CiAgICAgIDxwYXRoIGQ9Ik01NC4xNzEgMTUuMzM5IEwyODAuOTgzIDE1LjMzOSBDMjg5LjQ2IDE1LjMzOSAyOTYuMzIyIDIyLjIwMiAyOTYuMzIyIDMwLjY3OSBMMjk2LjMyMiAzNjkuOTggQzI5Ni4zMjIgMzc4LjQ1NyAyODkuNDYgMzg1LjMxOSAyODAuOTgzIDM4NS4zMTkgTDU0LjE3MSAzODUuMzE5IEM0NS42OTQgMzg1LjMxOSAzOC44MzIgMzc4LjQ1NyAzOC44MzIgMzY5Ljk4IEwzOC44MzIgMzAuNjc5IEMzOC44MzIgMjIuMjAyIDQ1LjY5NCAxNS4zMzkgNTQuMTcxIDE1LjMzOSBaIiBjbGFzcz0iY2xzLTUiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=");
        background-size:100% 100%; background-repeat:no-repeat; background-position:center;
      }`;
  },

  render() {
    return `<div class="bm-sticker-心得体会"><div class="bm-sticker-inner">${this.preview}</div></div>`;
  },
};

window.__bamboo_material_心得体会 = material;
