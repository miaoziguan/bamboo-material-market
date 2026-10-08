// 文件名: 锦鲤贴纸.js  →  全局变量: __bamboo_material_锦鲤贴纸
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用） © 2026 羽鳞君 保留所有权利

const material = {
  // type: 'sticker' = 可单独贴到已有便签上叠加的插画（本质=不可输入文字的卡片，
  // 插件复刻 tw-card 的拖拽/旋转/缩放/层级机制来承载它）
  type: 'sticker',
  name: '锦鲤贴纸',

  // 市场列表里「一张一张」展示的缩略图：内联 SVG，无需外链、零体积
  preview:
    '<svg viewBox="0 0 120 120" width="100%" height="100%" aria-label="锦鲤">' +
      '<circle cx="60" cy="60" r="56" fill="#fff7ef"/>' +
      '<path d="M30 64c14-18 46-18 60 0-14 18-46 18-60 0z" fill="#e8703a"/>' +
      '<path d="M86 64c8-6 14-4 16 0-2 4-8 6-16 0z" fill="#e8703a"/>' +
      '<circle cx="44" cy="60" r="4" fill="#2a2a2a"/>' +
    '</svg>',

  // 拖入画布 / 贴到卡片后，插件用此 DOM 包裹素材（外层由插件加拖拽手柄与变换）
  render() {
    return '<div class="bm-sticker-koi" aria-label="锦鲤贴纸">' + this.preview + '</div>';
  },

  init(el) {},
  destroy() {},
};

window.__bamboo_material_锦鲤贴纸 = material;
