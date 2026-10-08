// 文件名: 竹影模板.js  →  全局变量: __bamboo_material_竹影模板
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用） © 2026 羽鳞君 保留所有权利

// 模板素材：拖到画布＝新建预设便签（暮山紫纸纹 + 松风体字体）；拖到已有卡片＝套用该预设。
const material = {
  type: 'template',
  name: '竹影',
  preview:
    '<div style="width:100%;height:100%;border-radius:6px;background:linear-gradient(160deg,#2a2440,#3a2f55);' +
      'color:#e9e2ff;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'font-family:\'STKaiti\',\'KaiTi\',serif;">' +
      '<div style="font-size:22px;letter-spacing:.3em">竹影</div>' +
      '<div style="font-size:11px;opacity:.7;margin-top:4px">暮山紫 · 松风体</div></div>',
  preset: { paper: '暮山紫', font: '松风体' },
  render() { return ''; },
  init(el) {},
  destroy() {},
};
window.__bamboo_material_竹影模板 = material;
