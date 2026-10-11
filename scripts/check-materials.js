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
  BITMAP_MAX_PX: 512,       // 位图长边上限
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
