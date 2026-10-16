#!/usr/bin/env node
/**
 * check-materials.js — 素材发布闸门
 *
 * 目的：把「发布后才被发现的作者侧缺陷」前移到发布前拦截。
 *
 * 背景（这套规则每一条都对应一次真实事故）：
 *   · 观宇宙缩略图偏小留白  → viewBox 未贴合内容（内容只占 46%×80%）
 *   · 观宇宙整块白底        → 误加了铺满画布的不透明 <rect>
 *   · 腾云/驾雾串色丢细节   → 内嵌 <style> 用通用类名，多素材同屏时全局串色
 *   · 观系列位图 800px      → 位图分辨率/体积失控（base64 曾达 1999KB）
 *
 * 2026-10 增补：新增 css() 层检查（paper 皮肤）。背景是修「好好吃饭」时连踩 7 个坑，
 * 全部位于 css()，而旧规则只作用于 preview / manifest 缩略图，一例都没拦住：
 *   · 卡片 background:#ffffff      → 白底盖掉设计图，「便签没有背景」
 *   · .tw-card-head 漏 border:none → 主题默认 2px 下边框变成卡片底部一条灰线
 *   · 设计图被压成 500px 位图      → 用户一放大就发虚
 *   · 未定义 ::-webkit-scrollbar   → 吃 Obsidian 默认滚动条，在素净设计上很突兀
 *   · .tw-card-text 写死 font-size → 掐断字号变量链，A↑A↓ 全程无反应
 *   · 背景图宽高比与 aspect-ratio 不符 → background-size:100% 100% 拉伸变形
 * 另有一个反向陷阱：scrollbar-width:none 在新版 Chromium 中会彻底禁用滚动条，
 * 并使 ::-webkit-scrollbar 规则全部失效（发丝级悬停滚动条会静默失灵）。
 *
 * 设计原则（照抄插件侧 check:html-escape / check-load-matrix 的「闸门」范式）：
 *   1. 零依赖纯 Node —— CI 直接 node 跑，不需要 npm install；
 *   2. 失败即 exit 1，阻断合并/发布；
 *   3. 规则可豁免但必须登记理由（scripts/material-check-allow.json）；
 *   4. --report 输出全量指标，便于体检与阈值校准。
 *
 * 用法：
 *   node scripts/check-materials.js            # 闸门模式（有失败则 exit 1）
 *   node scripts/check-materials.js --report   # 报告模式（打印全量指标）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MF = path.join(ROOT, 'manifest.json');
const DIR = path.join(ROOT, 'materials');
const ALLOW_FILE = path.join(__dirname, 'material-check-allow.json');

/* ───────── 阈值（经全量体检校准，改前请先跑 --report 看真实分布） ───────── */
const LIMIT = {
  PREVIEW_MAX_KB: 100,      // 完整 preview（materials/*.js）上限
  THUMB_BITMAP_MAX_KB: 20,  // 位图类素材的 manifest 缩略图上限（矢量类缩略图即其本身，不单独限）
  BITMAP_MAX_PX: 512,       // preview 位图长边上限（缩略图场景，大反而浪费）
  CSS_BITMAP_MIN_PX: 1000,  // paper 背景位图长边下限（背景要铺满卡片，太小则一放大就发虚）
  FIT_MIN: 0.9,             // 内容包围盒占 viewBox 的最小比例（低于此＝留白）
  FIT_MAX: 1.25,            // 内容包围盒占 viewBox 的最大比例（高于此＝内容溢出被裁）
  BG_COVER_MIN: 0.9,        // 视为「铺满背景」的覆盖面积比例
};
const REPORT = process.argv.includes('--report');

/* ───────── WebP 尺寸（零依赖，解析 RIFF 容器） ───────── */
function webpSize(buf) {
  if (buf.length < 16) return null;
  if (buf.slice(0, 4).toString('latin1') !== 'RIFF') return null;
  if (buf.slice(8, 12).toString('latin1') !== 'WEBP') return null;
  let p = 12;
  while (p + 8 <= buf.length) {
    const fourcc = buf.slice(p, p + 4).toString('latin1');
    const size = buf.readUInt32LE(p + 4);
    const d = p + 8;
    // VP8X：1B flags + 3B reserved + 3B canvasW-1 + 3B canvasH-1
    if (fourcc === 'VP8X' && d + 10 <= buf.length) {
      const w = (buf[d + 4] | (buf[d + 5] << 8) | (buf[d + 6] << 16)) + 1;
      const h = (buf[d + 7] | (buf[d + 8] << 8) | (buf[d + 9] << 16)) + 1;
      return { w, h };
    }
    // VP8L：1B signature(0x2f) + 14b W-1 + 14b H-1 + 1b alpha + 3b version
    if (fourcc === 'VP8L' && d + 5 <= buf.length) {
      const v = buf.readUInt32LE(d + 1);
      return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 };
    }
    // VP8 ：3B frame tag + 3B start code(9d 01 2a) + 2B W(14b) + 2B H(14b)
    if (fourcc === 'VP8 ' && d + 11 <= buf.length) {
      return { w: buf.readUInt16LE(d + 6) & 0x3fff, h: buf.readUInt16LE(d + 8) & 0x3fff };
    }
    p += 8 + size + (size % 2);
  }
  return null;
}

/**
 * 椭圆弧采样（SVG 规范 F.6.5 圆心参数化）。
 * 不能用「起终点 ± 半径」外扩：插画里常见 a292 292 这类大半径弧，
 * 那样会把包围盒撑大数倍，导致贴合度误判。
 */
function arcPoints(x1, y1, rx, ry, phiDeg, laf, sf, x2, y2) {
  if (!rx || !ry) return [[x2, y2]];
  const phi = phiDeg * Math.PI / 180;
  const cosp = Math.cos(phi), sinp = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cosp * dx + sinp * dy;
  const y1p = -sinp * dx + cosp * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) { const s = Math.sqrt(lambda); rx *= s; ry *= s; }
  const sign = (laf !== sf) ? 1 : -1;
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = sign * Math.sqrt(Math.max(0, den ? num / den : 0));
  const cxp = co * (rx * y1p) / ry;
  const cyp = -co * (ry * x1p) / rx;
  const cx = cosp * cxp - sinp * cyp + (x1 + x2) / 2;
  const cy = sinp * cxp + cosp * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => {
    const d = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    let c = d ? (ux * vx + uy * vy) / d : 0;
    c = Math.min(1, Math.max(-1, c));
    const a = Math.acos(c);
    return (ux * vy - uy * vx < 0) ? -a : a;
  };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  const th1 = ang(1, 0, ux, uy);
  let dth = ang(ux, uy, vx, vy);
  if (!sf && dth > 0) dth -= 2 * Math.PI;
  else if (sf && dth < 0) dth += 2 * Math.PI;
  const out = [];
  const N = 16;
  for (let i = 0; i <= N; i++) {
    const th = th1 + dth * (i / N);
    const ct = Math.cos(th), st = Math.sin(th);
    out.push([cx + rx * ct * cosp - ry * st * sinp, cy + rx * ct * sinp + ry * st * cosp]);
  }
  return out;
}

/* ───────── 路径点集（曲线取控制点，保守外扩） ───────── */
function pathPoints(d) {
  const pts = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let m, cx = 0, cy = 0, sx = 0, sy = 0;
  while ((m = re.exec(d))) {
    const C = m[1].toUpperCase();
    const rel = m[1] !== C;
    const nums = (m[2].match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
    let i = 0;
    const n = () => (i < nums.length ? nums[i++] : 0);
    if (C === 'Z') { cx = sx; cy = sy; continue; }
    while (i < nums.length) {
      if (C === 'M' || C === 'L') {
        const x = n(), y = n();
        cx = rel ? cx + x : x; cy = rel ? cy + y : y;
        if (C === 'M') { sx = cx; sy = cy; }
        pts.push([cx, cy]);
      } else if (C === 'H') { const x = n(); cx = rel ? cx + x : x; pts.push([cx, cy]); }
      else if (C === 'V') { const y = n(); cy = rel ? cy + y : y; pts.push([cx, cy]); }
      else if (C === 'C') {
        const x1 = n(), y1 = n(), x2 = n(), y2 = n(), x = n(), y = n();
        pts.push([rel ? cx + x1 : x1, rel ? cy + y1 : y1], [rel ? cx + x2 : x2, rel ? cy + y2 : y2], [cx, cy]);
        cx = rel ? cx + x : x; cy = rel ? cy + y : y; pts.push([cx, cy]);
      } else if (C === 'S' || C === 'Q') {
        const x1 = n(), y1 = n(), x = n(), y = n();
        pts.push([rel ? cx + x1 : x1, rel ? cy + y1 : y1], [cx, cy]);
        cx = rel ? cx + x : x; cy = rel ? cy + y : y; pts.push([cx, cy]);
      } else if (C === 'T') {
        const x = n(), y = n(); pts.push([cx, cy]);
        cx = rel ? cx + x : x; cy = rel ? cy + y : y; pts.push([cx, cy]);
      } else if (C === 'A') {
        const rx = n(), ry = n(), rot = n(), laf = n(), sf = n(), x = n(), y = n();
        const e1 = rel ? cx + x : x, e2 = rel ? cy + y : y;
        for (const p of arcPoints(cx, cy, rx, ry, rot, laf, sf, e1, e2)) pts.push(p);
        cx = e1; cy = e2;
      } else break;
    }
  }
  return pts;
}

/* ───────── 2x3 变换矩阵 ───────── */
const IDENT = [1, 0, 0, 1, 0, 0];
// 复合：先应用 B 再应用 A
function mul(A, B) {
  return [
    A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1],
    A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3],
    A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5],
  ];
}
const applyM = (M, x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
function parseTransform(s) {
  let M = IDENT;
  const re = /(translate|scale|rotate|matrix)\s*\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(s))) {
    const v = m[2].split(/[\s,]+/).filter(Boolean).map(Number);
    let T = IDENT;
    if (m[1] === 'translate') T = [1, 0, 0, 1, v[0] || 0, v[1] || 0];
    else if (m[1] === 'scale') { const sx = v[0]; const sy = v.length > 1 ? v[1] : sx; T = [sx, 0, 0, sy, 0, 0]; }
    else if (m[1] === 'rotate') {
      const a = (v[0] || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      T = [c, s, -s, c, 0, 0];
      if (v.length === 3) T = mul([1, 0, 0, 1, v[1], v[2]], mul(T, [1, 0, 0, 1, -v[1], -v[2]]));
    } else if (m[1] === 'matrix') T = [v[0], v[1], v[2], v[3], v[4], v[5]];
    M = mul(M, T);
  }
  return M;
}

/** 估算内容包围盒：按标签顺序扫描，维护变换栈；<defs> 内不计入可见内容 */
function contentBBox(svg) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (p) => { if (p && Number.isFinite(p[0]) && Number.isFinite(p[1])) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; } };
  const num = (a, k, dflt) => { const m = a.match(new RegExp('\\b' + k + '="(-?[\\d.]+)"')); return m ? parseFloat(m[1]) : dflt; };
  const stack = [IDENT];
  let defsDepth = 0;
  const tagRe = /<(\/?)([A-Za-z][\w:-]*)\b([^>]*)>/g;
  let m;
  while ((m = tagRe.exec(svg))) {
    const closing = m[1] === '/';
    const name = m[2].toLowerCase();
    const attrs = m[3] || '';
    if (closing) {
      if (name === 'defs' && defsDepth > 0) defsDepth--;
      if (stack.length > 1) stack.pop();
      continue;
    }
    const M0 = stack[stack.length - 1];
    const tr = (attrs.match(/\btransform="([^"]*)"/) || [])[1];
    const M = tr ? mul(M0, parseTransform(tr)) : M0;
    const selfClose = /\/\s*$/.test(attrs);
    if (name === 'defs') defsDepth++;
    if (defsDepth === 0) {
      const put = (x, y) => add(applyM(M, x, y));
      if (name === 'path') { const d = (attrs.match(/\bd="([^"]*)"/) || [])[1]; if (d) for (const p of pathPoints(d)) put(p[0], p[1]); }
      else if (name === 'rect') { const x = num(attrs, 'x', 0), y = num(attrs, 'y', 0); put(x, y); put(x + num(attrs, 'width', 0), y + num(attrs, 'height', 0)); }
      else if (name === 'circle') { const cx = num(attrs, 'cx', 0), cy = num(attrs, 'cy', 0), r = num(attrs, 'r', 0); put(cx - r, cy - r); put(cx + r, cy + r); }
      else if (name === 'ellipse') { const cx = num(attrs, 'cx', 0), cy = num(attrs, 'cy', 0), rx = num(attrs, 'rx', 0), ry = num(attrs, 'ry', 0); put(cx - rx, cy - ry); put(cx + rx, cy + ry); }
      else if (name === 'polygon' || name === 'polyline') { const p = (attrs.match(/\bpoints="([^"]*)"/) || [])[1]; if (p) for (const pair of p.trim().split(/\s+/)) { const [x, y] = pair.split(',').map(Number); put(x, y); } }
      else if (name === 'foreignobject') { const x = num(attrs, 'x', 0), y = num(attrs, 'y', 0); put(x, y); put(x + num(attrs, 'width', 0), y + num(attrs, 'height', 0)); }
    }
    if (!selfClose) stack.push(M);
  }
  return x1 < x0 ? null : { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** 铺满画布的不透明背景矩形（观宇宙事故：误加 <rect fill="#ffffff" width=400 height=300>） */
function findFullCanvasBg(svg, vb) {
  const area = vb.w * vb.h;
  for (const m of svg.matchAll(/<rect\b([^>]*)>/g)) {
    const a = m[1];
    const w = parseFloat((a.match(/\bwidth="([\d.]+)"/) || [])[1] || '0');
    const h = parseFloat((a.match(/\bheight="([\d.]+)"/) || [])[1] || '0');
    if (!w || !h) continue;
    const fill = (a.match(/\bfill="([^"]*)"/) || [])[1];
    if (fill === undefined || fill === 'none' || fill === 'transparent') continue;
    if (/rgba\([^)]*,\s*0\s*\)/.test(fill)) continue;
    if ((w * h) / area >= LIMIT.BG_COVER_MIN) return { w, h, fill };
  }
  return null;
}

/* ───────── CSS 规则切分（零依赖，供 css() 层检查用） ─────────
 * 只处理扁平 CSS（素材 css() 均为扁平规则，无 @media / 无嵌套），
 * 返回 [{sel, body}]；sel 已压缩空白，便于匹配。 */
function cssRules(css) {
  const out = [];
  const s = String(css).replace(/\/\*[\s\S]*?\*\//g, '');
  let i = 0;
  while (i < s.length) {
    const open = s.indexOf('{', i);
    if (open < 0) break;
    let depth = 1, j = open + 1;
    while (j < s.length && depth > 0) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
      j++;
    }
    const close = j - 1;
    if (depth !== 0) break;
    out.push({
      sel: s.slice(i, open).trim().replace(/\s+/g, ' '),
      body: s.slice(open + 1, close),
    });
    i = close + 1;
  }
  return out;
}
const decl = (body, prop) => {
  const m = body.match(new RegExp('(?:^|;)\\s*' + prop + '\\s*:\\s*([^;]+)'));
  return m ? m[1].trim() : null;
};

/* 从 css() 里取出背景图的 SVG（兼容 base64 与 charset=utf-8 两种编码） */
function extractCssSvg(css) {
  let m = css.match(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/);
  if (m) { try { return Buffer.from(m[1], 'base64').toString('utf8'); } catch (e) { return null; } }
  m = css.match(/data:image\/svg\+xml;charset=utf-8,([^"')]+)/);
  if (m) { try { return decodeURIComponent(m[1]); } catch (e) { return null; } }
  return null;
}
/* 取出 css() 背景位图的 Buffer（SVG 内嵌或直接 data:） */
function extractCssBitmap(css, svg) {
  const pick = (s) => {
    const b = s && s.match(/data:image\/(?:png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)/i);
    return b ? Buffer.from(b[1], 'base64') : null;
  };
  return pick(svg) || pick(css);
}

/* ───────── 主流程 ───────── */
const allow = fs.existsSync(ALLOW_FILE) ? JSON.parse(fs.readFileSync(ALLOW_FILE, 'utf8')) : {};
const allowed = (id, rule) => !!(allow[id] && allow[id].includes(rule));
const failures = [];
const warns = [];
const table = [];
const fail = (id, rule, msg) => { if (!allowed(id, rule)) failures.push({ id, rule, msg }); };
const warn = (id, rule, msg) => { if (!allowed(id, rule)) warns.push({ id, rule, msg }); };
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

if (!fs.existsSync(MF)) { console.error('❌ 缺少 manifest.json'); process.exit(1); }
const mf = JSON.parse(fs.readFileSync(MF, 'utf8'));
const list = (mf && mf.materials) || [];
if (!list.length) { console.error('❌ manifest.materials 为空'); process.exit(1); }

const REQUIRED = ['id', 'name', 'type', 'author', 'version', 'description', 'preview', 'url'];
const VALID_TYPES = ['sticker', 'paper', 'font', 'template'];

for (const m of list) {
  const id = m.id;
  for (const k of REQUIRED) if (!m[k]) fail(id, 'manifest-fields', `manifest 缺少字段 ${k}`);
  if (m.type && !VALID_TYPES.includes(m.type)) fail(id, 'manifest-type', `type 非法: ${m.type}`);

  const jsPath = path.join(DIR, id + '.js');
  if (!fs.existsSync(jsPath)) { fail(id, 'file-missing', `缺少 materials/${id}.js`); continue; }
  if (!String(m.url || '').endsWith('/' + id + '.js')) fail(id, 'manifest-url', `url 未指向 ${id}.js: ${m.url}`);

  let material = null, err = '';
  try {
    const w = {};
    new Function('window', fs.readFileSync(jsPath, 'utf8'))(w);
    material = w['__bamboo_material_' + id];
  } catch (e) { err = e && e.message; }
  if (!material) { fail(id, 'js-exec', `materials/${id}.js 未导出 __bamboo_material_${id}${err ? '（' + err + '）' : ''}`); continue; }
  if (typeof material.render !== 'function') fail(id, 'js-render', '缺少 render()');

  const full = material.preview || '';
  const thumb = m.preview || '';
  const vbM = full.match(/viewBox\s*=\s*["']\s*(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  const vb = vbM ? { x: +vbM[1], y: +vbM[2], w: +vbM[3], h: +vbM[4] } : null;

  const checkStruct = (svg, tag) => {
    if (!svg.startsWith('<svg')) fail(id, 'svg-root', `${tag} 不以 <svg 开头`);
    if (!svg.trim().endsWith('</svg>')) fail(id, 'svg-root', `${tag} 不以 </svg> 结尾`);
    // 根 <svg> 必须自带尺寸声明（width 属性 或 style 里的 width）：
    // 缩略图容器（.bm-market-thumb 96×96）与画布都靠它填满。设计工具导出常用 width="100%" height="100%"，
    // 一旦被 svgo 的 removeUnknownsAndDefaults 当成「根元素默认值」删掉，浏览器会退回固有尺寸（= viewBox 像素），
    // 在 96px 缩略图里被 overflow:hidden 裁成「放大错位」——这正是腾云/驾雾系列预览图事故的成因。
    const rootTag = svg.slice(0, svg.indexOf('>') + 1);
    const sized = /(^|\s)width\s*=\s*["'](?:100%|\d)/i.test(rootTag) || /style\s*=\s*["'][^"']*\bwidth\s*:/i.test(rootTag);
    if (!sized) fail(id, 'root-size', `${tag} 根 <svg> 未声明尺寸（缺 width 属性 / style 的 width），会在缩略图与画布中放大错位；请加 width="100%" height="100%"`);
    if (/<script/i.test(svg)) fail(id, 'no-script', `${tag} 含 <script>`);
    if (/\son[a-z]+\s*=/i.test(svg)) fail(id, 'no-event-attr', `${tag} 含事件属性（onload/onclick…）`);
    if (/javascript:/i.test(svg)) fail(id, 'no-javascript-url', `${tag} 含 javascript: 协议`);
    for (const mm of svg.matchAll(/(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/g)) {
      if (/https?:\/\//i.test(mm[1])) fail(id, 'no-external', `${tag} 引用外部资源: ${mm[1].slice(0, 60)}`);
    }
    if (/<style/i.test(svg)) fail(id, 'no-global-style', `${tag} 含内嵌 <style>（会全局生效导致串色）`);
    if (/class="/i.test(svg)) fail(id, 'no-class', `${tag} 残留 class=（应内联为 fill 等属性）`);
    const bm = svg.match(/data:image\/(webp|png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)/i);
    let w = 0, h = 0, bytes = 0;
    if (bm) {
      const buf = Buffer.from(bm[2], 'base64');
      bytes = buf.length;
      if (/webp/i.test(bm[1])) { const d = webpSize(buf); if (d) { w = d.w; h = d.h; } }
      if (w || h) {
        const long = Math.max(w, h);
        if (long > LIMIT.BITMAP_MAX_PX) fail(id, 'bitmap-size', `${tag} 位图长边 ${long}px > ${LIMIT.BITMAP_MAX_PX}px`);
      }
    }
    return { w, h, bytes };
  };

  const fInfo = checkStruct(full, 'preview');
  checkStruct(thumb, 'manifest缩略图');

  const kb = (s) => Buffer.byteLength(s, 'utf8') / 1024;
  if (kb(full) > LIMIT.PREVIEW_MAX_KB) fail(id, 'size-budget', `preview ${kb(full).toFixed(1)}KB > ${LIMIT.PREVIEW_MAX_KB}KB`);
  // 位图类素材的缩略图必须显著小于本体；矢量类缩略图即其本身，不单独限
  // 仅约束「以位图为主」的素材（位图占 preview 30% 以上）：
  // 矢量为主、仅附带极小位图的素材（如东方：92KB 矢量 + 0.3KB 图标）不适用此预算
  if (fInfo.bytes > Buffer.byteLength(full, 'utf8') * 0.3 && kb(thumb) > LIMIT.THUMB_BITMAP_MAX_KB) {
    fail(id, 'thumb-budget', `位图类 manifest 缩略图 ${kb(thumb).toFixed(1)}KB > ${LIMIT.THUMB_BITMAP_MAX_KB}KB（缩略图应显著小于本体）`);
  }

  let fw = NaN, fh = NaN;
  if (vb) {
    const bb = contentBBox(full);
    if (!bb) fail(id, 'bbox', '无法解析内容包围盒');
    else {
      fw = bb.w / vb.w; fh = bb.h / vb.h;
      if (fw < LIMIT.FIT_MIN || fh < LIMIT.FIT_MIN) {
        fail(id, 'viewbox-fit', `viewBox 未贴合内容：内容占 ${(fw * 100).toFixed(0)}%×${(fh * 100).toFixed(0)}%（需 ≥${LIMIT.FIT_MIN * 100}%）；建议 viewBox="${bb.x.toFixed(1)} ${bb.y.toFixed(1)} ${bb.w.toFixed(1)} ${bb.h.toFixed(1)}"`);
      } else if (fw > LIMIT.FIT_MAX || fh > LIMIT.FIT_MAX) {
        // 仅告警：素材若使用 clip-path，几何包围盒无法建模裁剪，硬判会误报
        warn(id, 'viewbox-overflow', `内容几何范围超出 viewBox：${(fw * 100).toFixed(0)}%×${(fh * 100).toFixed(0)}%（可能已被 clip-path 裁切，需人工确认）`);
      }
      const bg = findFullCanvasBg(full, vb);
      if (bg) fail(id, 'no-bg-rect', `存在铺满画布的不透明背景 rect（${bg.w}×${bg.h} fill=${bg.fill}）`);
    }
  }

  /* ───────── paper 专属：css() 层检查 ─────────
   * 2026-10 修「好好吃饭」时连踩 7 个坑，全部位于 css()，而旧闸门只查 preview
   * （checkStruct 仅作用于 preview / manifest 缩略图），一例都没拦住。
   * 此处把每一条固化为规则，注释写明对应的事故。 */
  if (m.type === 'paper') {
    const cssRaw = typeof material.css === 'function' ? material.css() : '';
    if (!cssRaw || !cssRaw.trim()) {
      fail(id, 'css-missing', 'type=paper 但缺少 css()——便签的设计图、文字区、滚动条全在这里');
    } else {
      // 先剥掉 CSS 注释再跑正则——模板/素材的注释里常提到 scrollbar-width:none 等字样，会误判
      const css = cssRaw.replace(/\/\*[\s\S]*?\*\//g, '');
      const R = cssRules(css);
      const norm = (s) => s.replace(/\s+/g, '');
      const bySel = (re) => R.find(r => re.test(norm(r.sel)));

      // 卡片主规则
      const card = bySel(/^\.tw-card\[data-paper=[^\]]*\]$/);
      if (!card) {
        fail(id, 'css-card-rule', '缺少 .tw-card[data-paper="<id>"] 卡片规则（aspect-ratio / 纸纹变量都挂在它身上）');
      } else {
        // ① 事故：好好吃饭曾写 background:#ffffff，白底+白面板融为一体 → 「便签没有背景」
        // 仅拦截「显式写成不透明」；未声明则继承主题默认（梦珑系列即如此），不算问题
        const bg = decl(card.body, 'background');
        if (bg && !/^(transparent|var\(--rice-paper\)|none)$/i.test(bg)) {
          fail(id, 'css-bg-opaque', `卡片 background 应为 transparent（背景交给设计图），当前为 ${bg}`);
        }
        // ② 纸纹取值键缺失会让标题墨色/分隔线退回主题默认值
        for (const v of ['--ink-dark', '--tw-rule-rgb']) {
          if (!card.body.includes(v)) fail(id, 'css-ink-vars', `卡片规则缺少 ${v}（主题墨色/分隔线取值键，见 README「纸纹取值键」）`);
        }
      }

      // ③ 事故：主题 .tw-card-head 默认带 border-bottom:2px solid rgba(var(--tw-rule-rgb),.14)，
      //    paper 规则特异性 (0,3,0) 高于基础 (0,1,0)，不显式 border:none 就会在卡片底部多出一条灰线
      const head = bySel(/\.tw-card-head\{?$/);
      if (!head) fail(id, 'css-head-rule', '缺少 .tw-card-head 规则');
      else if (!/(?:^|;)\s*border\s*:\s*none/i.test(head.body)) {
        fail(id, 'css-head-border', '.tw-card-head 未设置 border:none——主题默认的 2px 下边框会变成卡片底部一条灰线');
      }

      // ④ 齿边/噪点元素不隐藏会带来主题默认装饰
      for (const part of ['edge', 'noise']) {
        const r = R.find(x => norm(x.sel).includes('.tw-card-' + part) && /display\s*:\s*none/.test(x.body));
        if (!r) fail(id, 'css-edge-noise', `未隐藏 .tw-card-${part}（应加 display:none，对齐可用皮肤模板）`);
      }

      // ⑤ 事故：好好吃饭在 paper 规则里写死 font-size:0.9em，掐断
      //    A↑A↓ → --tw-text-zoom → --tw-fs-base → .tw-card-text 的变量链，字号调节全程无反应
      const text = bySel(/\.tw-card-text\{?$/);
      if (!text) fail(id, 'css-text-rule', '缺少 .tw-card-text 规则（文字编辑区）');
      else {
        if (decl(text.body, 'font-size')) {
          fail(id, 'css-text-font-size', '.tw-card-text 禁止写 font-size——主题靠 var(--tw-fs-base) 联动字号按钮，paper 规则特异性更高，写死即使字号 ± 失效');
        }
        if (!/overflow\s*:\s*auto/.test(text.body)) {
          fail(id, 'css-text-overflow', '.tw-card-text 需要 overflow:auto，否则内容溢出后无法滚动查看');
        }
      }

      // ⑥ 事故：未定义滚动条样式时吃 Obsidian/Electron 默认滚动条（宽、取强调色、通栏），在素净设计上很突兀
      if (!/::-webkit-scrollbar/.test(css)) {
        fail(id, 'css-scrollbar', '未定义 ::-webkit-scrollbar——会显示 Obsidian 默认滚动条；请套用模板里的发丝级悬停滚动条');
      }
      // 陷阱：新版 Chromium 中 scrollbar-width:none 会彻底禁用滚动条，并使 ::-webkit-scrollbar 规则全部失效
      if (/scrollbar-width\s*:\s*none/.test(css)) {
        fail(id, 'css-scrollbar-width', '不要用 scrollbar-width:none——Chromium 会连带禁用 ::-webkit-scrollbar，发丝级悬停滚动条将失效');
      }

      // ⑦ 背景图体检（旧闸门完全不看这里）
      const svg = extractCssSvg(css);
      if (svg) {
        for (const [re, rule, msg] of [
          [/<script/i, 'no-script', 'css() 背景图含 <script>'],
          [/\son[a-z]+\s*=/i, 'no-event-attr', 'css() 背景图含事件属性'],
          [/javascript:/i, 'no-javascript-url', 'css() 背景图含 javascript: 协议'],
        ]) if (re.test(svg)) fail(id, rule, msg);
        for (const mm of svg.matchAll(/(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/g)) {
          if (/https?:\/\//i.test(mm[1])) fail(id, 'no-external', `css() 背景图引用外部资源: ${mm[1].slice(0, 60)}`);
        }
        // 事故：梦珑香梨的整张设计被栅格成一张 400px 位图塞进 SVG，放大即整体发虚。
        // 只在位图「铺满设计」时才告警——小面积装饰件（如梦珑星光/樱桃等约占 50%）是合法设计选择
        const imgM = svg.match(/<image\b[^>]*>/i);
        if (imgM) {
          const vb2 = (svg.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/) || []).slice(1);
          const g = (re) => { const mm = imgM[0].match(re); return mm ? +mm[1] : null; };
          const iw = g(/\bwidth\s*=\s*"([\d.]+)"/), ih = g(/\bheight\s*=\s*"([\d.]+)"/);
          if (vb2.length === 2 && iw && ih) {
            const cover = (iw * ih) / (+vb2[0] * +vb2[1]);
            if (cover >= 0.9) {
              warn(id, 'css-bitmap-in-svg', `背景 SVG 被一张 ${iw}x${ih} 位图铺满（占画布 ${(cover * 100).toFixed(0)}%）——整张设计已被栅格化，放大必虚；请找回矢量原稿`);
            }
          }
        }
      }
      const bmp = extractCssBitmap(css, svg);
      if (bmp && bmp.length > 8) {
        const sig = bmp.slice(1, 4).toString('latin1');
        if (sig === 'PNG') {
          const bw = bmp.readUInt32BE(16), bh = bmp.readUInt32BE(20);
          // 事故：好好吃饭曾把设计图下采样到 500px 宽，用户一放大就发虚
          if (Math.max(bw, bh) < LIMIT.CSS_BITMAP_MIN_PX) {
            warn(id, 'css-bitmap-small', `背景位图仅 ${bw}x${bh}（长边 < ${LIMIT.CSS_BITMAP_MIN_PX}px）——放大易发虚，建议改用矢量 SVG 或提高位图分辨率`);
          }
          // 形变：background-size:100% 100% 会强行拉伸，宽高比不符就变形
          if (card) {
            const ar = (card.body.match(/aspect-ratio\s*:\s*([\d.]+)\s*\/\s*([\d.]+)/) || []).slice(1);
            if (ar.length === 2) {
              const want = +ar[0] / +ar[1], got = bw / bh;
              if (Math.abs(want - got) / want > 0.01) {
                fail(id, 'css-viewbox-aspect', `背景位图宽高比 ${got.toFixed(4)} 与 aspect-ratio ${want.toFixed(4)} 偏差 >1%，background-size:100% 100% 会拉伸变形`);
              }
            }
          }
        }
      }
      if (svg && card) {
        const vb = (svg.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/) || []).slice(1);
        const ar = (card.body.match(/aspect-ratio\s*:\s*([\d.]+)\s*\/\s*([\d.]+)/) || []).slice(1);
        if (vb.length === 2 && ar.length === 2) {
          const want = +ar[0] / +ar[1], got = +vb[0] / +vb[1];
          if (Math.abs(want - got) / want > 0.01) {
            fail(id, 'css-viewbox-aspect', `背景 SVG viewBox 宽高比 ${got.toFixed(4)} 与 aspect-ratio ${want.toFixed(4)} 偏差 >1%，background-size:100% 100% 会拉伸变形`);
          }
        }
      }
    }
  }

  table.push({
    id, type: m.type, prev: kb(full), thumb: kb(thumb),
    bmp: fInfo.w ? `${fInfo.w}x${fInfo.h}` : '-',
    bmpKB: fInfo.bytes / 1024,
    fit: (fw && fh) ? `${(fw * 100).toFixed(0)}%×${(fh * 100).toFixed(0)}%` : '-',
    vb: vb ? `${vb.x} ${vb.y} ${vb.w} ${vb.h}` : '-',
  });
}

/* ───────── 输出 ───────── */
if (REPORT) {
  console.log('=== 素材体检报告 ===');
  console.log(pad('id', 10) + pad('type', 9) + padL('preview', 9) + padL('缩略图', 9) + padL('位图', 12) + padL('位图KB', 9) + padL('内容占比', 12) + 'viewBox');
  for (const r of table.slice().sort((a, b) => b.prev - a.prev)) {
    console.log(pad(r.id, 10) + pad(r.type, 9) + padL(r.prev.toFixed(1) + 'K', 9) + padL(r.thumb.toFixed(1) + 'K', 9) + padL(r.bmp, 12) + padL(r.bmpKB.toFixed(1), 9) + padL(r.fit, 12) + r.vb);
  }
  const sumP = table.reduce((a, r) => a + r.prev, 0), sumT = table.reduce((a, r) => a + r.thumb, 0);
  console.log(`\n合计: preview ${sumP.toFixed(0)}KB | manifest 缩略图 ${sumT.toFixed(0)}KB | 素材数 ${table.length}`);
}

if (warns.length) {
  console.log(`\n⚠️  告警 ${warns.length} 处（不阻断）`);
  const byW = {};
  for (const w of warns) (byW[w.rule] = byW[w.rule] || []).push(w);
  for (const [rule, arr] of Object.entries(byW)) {
    console.log(`  【${rule}】${arr.length} 处`);
    for (const w of arr.slice(0, 8)) console.log(`    · ${w.id}: ${w.msg}`);
    if (arr.length > 8) console.log(`    … 另有 ${arr.length - 8} 处`);
  }
}

if (!failures.length) {
  console.log(`\n✅ 素材闸门通过：${table.length} 个素材全部符合规范。`);
  process.exit(0);
}
console.log(`\n❌ 素材闸门未通过：${failures.length} 处问题`);
const byRule = {};
for (const f of failures) (byRule[f.rule] = byRule[f.rule] || []).push(f);
for (const [rule, arr] of Object.entries(byRule)) {
  console.log(`\n  【${rule}】${arr.length} 处`);
  for (const f of arr.slice(0, 12)) console.log(`    · ${f.id}: ${f.msg}`);
  if (arr.length > 12) console.log(`    … 另有 ${arr.length - 12} 处`);
}
console.log('\n修复指引：优先改素材本身；确需豁免时在 scripts/material-check-allow.json 登记理由。');
process.exit(1);
