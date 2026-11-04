
// 文件名: 玉米.js  →  全局变量: __bamboo_material_玉米
// 版权：竹林用户专享 · 未经授权禁止使用（含个人使用）© 2026 羽鳞君 保留所有权利
// 系列：蔬菜

const material = {
  type: 'sticker',
  name: '玉米',

  // 市场列表缩略图：内联用户设计 SVG（默认 preserveAspectRatio=meet 不失真）
  preview:
    `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 121.836 193.213">
  <defs>
    <linearGradient id="veg3-linear-gradient-1" x1="24.628" y1="89.624" x2="97.208" y2="89.624" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f8f004"/>
      <stop offset="1" stop-color="#fcc709"/>
    </linearGradient>
    <linearGradient id="veg3-linear-gradient-2" x1="1.975" y1="145.81" x2="119.861" y2="145.81" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#a7ff0e"/>
      <stop offset="0.191" stop-color="#a7df0e" data-vc-midpoint="0.3973"/>
      <stop offset="0.4808" stop-color="#a7be0e"/>
      <stop offset="0.7954" stop-color="#a0b50e" data-vc-midpoint="0.606"/>
      <stop offset="1" stop-color="#98ab0e"/>
    </linearGradient>
  </defs>
  <title>Asset 105</title>
  <g id="veg3-Asset_105" data-name="Asset 105">
    <g>
      <path d="M98.942 100.333 C105.518 97.866 112.181 97.999 118.736 100.481 C119.86 100.907 121.461 101.312 121.795 102.608 C122.257 104.399 118.675 106.852 117.474 108.049 C113.149 112.363 109.554 117.264 107.096 122.873 C101.215 136.298 106.077 148.767 97.959 161.358 C93.241 168.675 85.418 173.723 76.972 175.622 C76.378 199.077 45.458 199.077 44.865 175.622 C36.418 173.723 28.595 168.675 23.877 161.358 C15.759 148.767 20.622 136.298 14.74 122.873 C12.282 117.264 8.687 112.363 4.362 108.049 C3.161 106.852 -0.421 104.399 0.041 102.608 C0.375 101.312 1.976 100.907 3.101 100.481 C9.655 97.999 16.318 97.866 22.894 100.333 C21.558 73.614 25.472 30.821 43.473 9.57 C47.862 4.389 53.757 0.044 60.814 0 C67.811 -0.043 73.691 4.161 78.097 9.259 C96.34 30.37 100.279 73.607 98.942 100.333 Z" fill="#fcc709"/>
      <g>
        <g>
          <ellipse cx="60.918" cy="89.624" rx="36.29" ry="87.619" fill="url(#veg3-linear-gradient-1)"/>
          <path d="M1.975 103.112 C36.84 87.412 58.488 148.623 60.918 155.892 C63.348 148.623 84.996 87.412 119.861 103.112 C113.145 108.961 101.445 120.595 101.445 140.81 C101.445 170.552 75.013 173.958 75.013 173.958 L74.92 177.646 C74.731 185.116 68.62 191.074 61.147 191.074 L61.147 191.074 L60.689 191.074 L60.689 191.074 C53.216 191.074 47.106 185.116 46.916 177.646 L46.823 173.958 C46.823 173.958 20.391 170.552 20.391 140.81 C20.391 120.595 8.692 108.961 1.975 103.112 Z" fill="url(#veg3-linear-gradient-2)"/>
        </g>
      </g>
    </g>
  </g>
</svg>`,

  // 拖入画布后，插件用此 DOM 包裹素材（外层由插件加拖拽/旋转/缩放手柄）
  render() {
    return '<div class="bm-sticker-玉米" aria-label="玉米贴纸">' + this.preview + '</div>';
  },

  init(el) {},
  destroy() {},
};

window.__bamboo_material_玉米 = material;
