// 文件名: 松风体.js  →  全局变量: __bamboo_material_松风体
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用） © 2026 羽鳞君 保留所有权利

// 字体素材：下载后注入 @font-face 并并入「切换字体」循环；拖到卡片＝换字体。
// 注意：本文件为「字体素材管线」演示，用系统楷体栈（local()）即可验证流程，无需附带字体二进制。
// 正式上架请改为：@font-face { src: url('松风体.woff2') }（务必确认字体授权为 SIL OFL / CC0 / 原创）。
const material = {
  type: 'font',
  name: '松风体',
  preview:
    '<div style="width:100%;height:100%;border-radius:6px;background:#f4efe6;color:#3a3027;' +
      'display:flex;align-items:center;justify-content:center;font-family:\'STKaiti\',\'KaiTi\',serif;font-size:34px">松</div>',
  css() {
    return '' +
      '@font-face{font-family:\'松风体\';src:local(\'STKaiti\'),local(\'KaiTi\'),local(\'Songti SC\');}' +
      '.tw-card[data-font="松风体"]{font-family:\'松风体\',\'STKaiti\',\'KaiTi\',serif;}';
  },
  render() { return ''; },
  init(el) {},
  destroy() {},
};
window.__bamboo_material_松风体 = material;
