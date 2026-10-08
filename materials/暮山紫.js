// 文件名: 暮山紫.js  →  全局变量: __bamboo_material_暮山紫
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用） © 2026 羽鳞君 保留所有权利

const material = {
  // type: 'paper' = 一种便签皮肤；拖进画布=新建一张 this.data-paper 的便签
  type: 'paper',
  name: '暮山紫',

  // 纸纹预览：用一张小卡片示意配色
  preview:
    '<div style="width:100%;height:100%;border-radius:6px;' +
      'background:linear-gradient(160deg,#2a2440,#3a2f55);color:#e9e2ff;' +
      'display:flex;align-items:flex-end;padding:8px;font-size:11px;letter-spacing:.2em">暮山紫</div>',

  // 注入到 .tw-card[data-paper="暮山紫"] 的 CSS —— 作用域隔离，遵循现有纸纹写法
  // （见 webapp/assets/styles/notes.css:331 起 plain/night 的取值键：
  //   --rice-paper / --ink-dark / --ink-pale / --tw-rule-rgb）
  css() {
    return '' +
      '.tw-card[data-paper="暮山紫"]{' +
        '--rice-paper:#2a2440;--ink-dark:#e9e2ff;--ink-pale:#b9aee0;' +
        '--tw-rule-rgb:233,226,255;' +
      '}' +
      '.tw-card[data-paper="暮山紫"] .tw-card-main{' +
        'background:linear-gradient(160deg,#2a2440,#3a2f55);' +
        'color:var(--ink-dark);' +
      '}' +
      '.tw-card[data-paper="暮山紫"] .tw-card-title{color:var(--ink-pale);}';
  },

  render() { return ''; },  // paper 类型无需 render（由插件用 css() 注入 + 新建卡片）
  init(el) {},
  destroy() {},
};

window.__bamboo_material_暮山紫 = material;
