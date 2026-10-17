#!/usr/bin/env node
'use strict';
/**
 * visual-diff.js — 素材视觉回归 / 像素比对工具
 *
 * 把「临时用 resvg 渲染 SVG 再逐项肉眼/像素对比」固化成可复用命令。
 * 依赖（均已在 node_modules）：@resvg/resvg-js（渲染）、pngjs（解码/编码）。
 *
 * 用法：
 *   对比两素材       node scripts/visual-diff.js <idA> <idB>
 *   单素材回归       node scripts/visual-diff.js <idA>            # 与已存基线比；无基线则只报尺寸
 *   写基线           node scripts/visual-diff.js <idA> --baseline
 *   预览vs背景图     node scripts/visual-diff.js <idA> --self     # 验证"转矢量"没跑偏
 *   选项：
 *     --width 800      渲染宽度（默认 800，两图同宽等比缩放）
 *     --tol 16         颜色距离容差（0–441，默认 16；低于此不算差异像素，抗抗锯齿噪声）
 *     --threshold 5    差异像素百分比阈值（默认 5）；超过则 exit 1（可接 CI 回归）
 *     --bg white       对齐时短边填充（white|transparent，默认 white；paper 场景白底）
 *     --out diff.png   差异图输出（默认 materials/.baseline/<A>__vs__<B>.diff.png）
 *     --json           仅输出 JSON 指标
 *   materials/.baseline/ 目录用于存放基线 PNG（golden image，可 gitignore 或随仓库提交）
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'materials');
const BASE = path.join(ROOT, 'materials', '.baseline');

function loadMaterial(id) {
  const jsPath = path.join(DIR, id + '.js');
  if (!fs.existsSync(jsPath)) throw new Error('缺少 materials/' + id + '.js');
  const w = {};
  new Function('window', fs.readFileSync(jsPath, 'utf8'))(w);
  const m = w['__bamboo_material_' + id];
  if (!m) throw new Error('未导出 __bamboo_material_' + id);
  return m;
}
function getPreview(m) {
  const svg = m.preview || '';
  if (!svg.startsWith('<svg')) throw new Error('preview 不是 SVG');
  return svg;
}
// 从 css() 里取出背景图 SVG（兼容 base64 与 charset=utf-8 两种编码，与 check-materials 一致）
function extractCssSvg(css) {
  if (!css) return null;
  let uri = null;
  for (const mm of css.matchAll(/url\(\s*(["'])([^"']+)\1\s*\)/g)) {
    if (mm[2].includes('image/svg+xml')) { uri = mm[2]; break; }
  }
  if (!uri) return null;
  if (uri.startsWith('data:image/svg+xml;base64,')) {
    try { return Buffer.from(uri.slice('data:image/svg+xml;base64,'.length), 'base64').toString('utf8'); } catch (e) { return null; }
  }
  if (uri.startsWith('data:image/svg+xml;charset=utf-8,')) {
    try { return decodeURIComponent(uri.slice('data:image/svg+xml;charset=utf-8,'.length)); } catch (e) { return null; }
  }
  return null;
}
function render(svg, width) {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  return r.render().asPng();
}
function decode(buf) {
  const p = PNG.sync.read(buf);
  return { width: p.width, height: p.height, data: p.data };
}
function align(a, b, bg) {
  const W = Math.max(a.width, b.width), H = Math.max(a.height, b.height);
  const fill = bg === 'transparent' ? [0, 0, 0, 0] : [255, 255, 255, 255];
  const norm = (s) => {
    if (s.width === W && s.height === H) return s;
    const out = Buffer.alloc(W * H * 4);
    for (let i = 0; i < out.length; i += 4) { out[i] = fill[0]; out[i + 1] = fill[1]; out[i + 2] = fill[2]; out[i + 3] = fill[3]; }
    for (let y = 0; y < s.height; y++)
      for (let x = 0; x < s.width; x++) {
        const so = (y * s.width + x) * 4, d = (y * W + x) * 4;
        out[d] = s.data[so]; out[d + 1] = s.data[so + 1]; out[d + 2] = s.data[so + 2]; out[d + 3] = s.data[so + 3];
      }
    return { width: W, height: H, data: out };
  };
  return [norm(a), norm(b)];
}
function diff(a, b, tol, bg) {
  const [A, B] = align(a, b, bg);
  const N = A.width * A.height;
  let diffPx = 0, sumSq = 0;
  const out = Buffer.from(A.data);
  for (let i = 0; i < N; i++) {
    const o = i * 4;
    const dr = A.data[o] - B.data[o], dg = A.data[o + 1] - B.data[o + 1], db = A.data[o + 2] - B.data[o + 2];
    const d2 = dr * dr + dg * dg + db * db;
    sumSq += d2;
    if (Math.sqrt(d2) > tol) {
      diffPx++;
      out[o] = 255; out[o + 1] = 0; out[o + 2] = 0; // 标红
    }
  }
  const mse = sumSq / (N * 3);
  const psnr = mse === 0 ? Infinity : 10 * Math.log10(255 * 255 / mse);
  return { W: A.width, H: A.height, diffPx, diffPct: diffPx / N * 100, mse, psnr, img: out };
}

const argv = process.argv.slice(2);
const flags = {};
const ids = [];
const VALUED = new Set(['width', 'tol', 'threshold', 'out', 'bg']);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const [k, v] = a.slice(2).split('=');
    if (v !== undefined) flags[k] = v;
    else if (VALUED.has(k)) flags[k] = argv[++i];
    else flags[k] = true;
  } else ids.push(a);
}
const WIDTH = +(flags.width || 800);
const TOL = +(flags.tol || 16);
const THRESHOLD = +(flags.threshold || 5);
const BG = (flags.bg || 'white');
const JSON_OUT = !!flags.json;

function main() {
  if (ids.length === 0) {
    console.error('用法: node scripts/visual-diff.js <idA> [<idB>] [--baseline|--self] [--width 800] [--tol 16] [--threshold 5] [--bg white|transparent] [--out diff.png] [--json]');
    process.exit(2);
  }
  if (ids.length === 1) {
    const id = ids[0];
    const mat = loadMaterial(id);
    const a = decode(render(getPreview(mat), WIDTH));
    if (flags.self) {
      const cssRaw = typeof mat.css === 'function' ? mat.css() : '';
      const svgB = extractCssSvg(cssRaw);
      if (!svgB) { console.error('该素材 css() 无背景 SVG，无法 --self 比对'); process.exit(2); }
      const b = decode(render(svgB, WIDTH));
      const r = diff(a, b, TOL, BG);
      const outPath = flags.out || path.join(BASE, id + '.self.diff.png');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, PNG.sync.write({ width: r.W, height: r.H, data: r.img }));
      report(id, id + '(css背景图)', r, THRESHOLD, 'self', outPath);
      return;
    }
    if (flags.baseline) {
      fs.mkdirSync(BASE, { recursive: true });
      const p = path.join(BASE, id + '.png');
      fs.writeFileSync(p, render(getPreview(mat), WIDTH));
      console.log('✅ 已写基线 ' + p);
      return;
    }
    const p = path.join(BASE, id + '.png');
    if (!fs.existsSync(p)) {
      console.log(`ℹ️  无基线 ${p}，仅渲染：preview ${a.width}x${a.height}`);
      return;
    }
    const b = decode(fs.readFileSync(p));
    const r = diff(a, b, TOL, BG);
    report(id, id + '(baseline)', r, THRESHOLD, 'regression', null);
    return;
  }
  // 两个素材
  const [idA, idB] = ids;
  const a = decode(render(getPreview(loadMaterial(idA)), WIDTH));
  const b = decode(render(getPreview(loadMaterial(idB)), WIDTH));
  const r = diff(a, b, TOL, BG);
  const outPath = flags.out || path.join(BASE, `${idA}__vs__${idB}.diff.png`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, PNG.sync.write({ width: r.W, height: r.H, data: r.img }));
  report(idA, idB, r, THRESHOLD, 'pair', outPath);
}

function report(idA, idB, r, threshold, mode, outPath) {
  if (JSON_OUT) {
    console.log(JSON.stringify({
      idA, idB, mode, W: r.W, H: r.H, diffPx: r.diffPx,
      diffPct: +r.diffPct.toFixed(3), mse: +r.mse.toFixed(2),
      psnr: isFinite(r.psnr) ? +r.psnr.toFixed(2) : null,
      threshold, pass: r.diffPct <= threshold,
    }));
    process.exit(r.diffPct <= threshold ? 0 : 1);
  }
  console.log(`=== 视觉 diff：${idA} vs ${idB} ===`);
  console.log(`模式       ${mode}`);
  console.log(`画布       ${r.W}x${r.H}`);
  console.log(`差异像素   ${r.diffPx} (${(r.diffPct).toFixed(2)}%)`);
  console.log(`MSE        ${r.mse.toFixed(2)}`);
  console.log(`PSNR       ${isFinite(r.psnr) ? r.psnr.toFixed(2) + 'dB' : '∞'} (越大越像)`);
  if (outPath) console.log(`差异图     ${outPath}`);
  const pass = r.diffPct <= threshold;
  console.log(pass ? `✅ 通过（≤${threshold}%）` : `❌ 超阈值（>${threshold}%）`);
  process.exit(pass ? 0 : 1);
}
main();
