#!/usr/bin/env node
/**
 * new-paper.js — paper 便签皮肤生成器
 *
 * 把「新做一个皮肤」压缩成一条命令。模板即 materials/_template.paper.js，
 * 本脚本只负责填值，不另存一份 CSS 真值——改模板即改生成器产出。
 *
 * 用法：node scripts/new-paper.js <名字> <设计稿.svg|png> [选项]
 *   --top 35% --left 18.5% --right 18.5% --bottom 15%   文字编辑区（默认取模板值）
 *   --ink-dark "#1a1a1a" / --ink-pale "#8c857c" / --rule "140,133,124"   墨色
 *   --series <系列名> / --desc <描述> / --author <作者>   manifest 字段
 *   --force 覆盖已存在文件    --no-gate 跳过闸门
 *
 * 设计稿自动规范化（与既有素材同标准）：
 *   · <style> + class=  →  内联 fill/stroke 属性
 *   · 根 <svg> 补 width="100%" height="100%"
 *   · 去掉 <?xml?> 声明与 <title>
 * 位图亦可作设计稿，但闸门会对长边 <1000px 告警（放大易发虚）。
 */
'use strict';
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "materials");
const MF = path.join(ROOT, "manifest.json");
const TEMPLATE = path.join(DIR, "_template.paper.js");
const PLACEHOLDER = "你的皮肤名";

const argv = process.argv.slice(2);
const opts = {};
const pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) {
    const k = a.slice(2);
    if (["top", "left", "right", "bottom", "ink-dark", "ink-pale", "rule", "series", "desc", "author"].includes(k)) opts[k] = argv[++i];
    else if (k === "force") opts.force = true;
    else if (k === "no-gate") opts.noGate = true;
    else { console.error("未知选项: " + a); process.exit(1); }
  } else pos.push(a);
}
const [name, designFile] = pos;
if (!name || !designFile) {
  console.error("用法: node scripts/new-paper.js <名字> <设计稿.svg|png> [选项]");
  console.error("例:   node scripts/new-paper.js 食说 design.svg --top 34% --left 18%");
  process.exit(1);
}
if (!fs.existsSync(designFile)) { console.error("找不到设计稿: " + designFile); process.exit(1); }
if (!fs.existsSync(TEMPLATE)) { console.error("找不到模板: " + TEMPLATE); process.exit(1); }

const target = path.join(DIR, name + ".js");
if (fs.existsSync(target) && !opts.force) {
  console.error("materials/" + name + ".js 已存在。加 --force 覆盖，或换个名字。");
  process.exit(1);
}

/* ---------- 设计稿规范化 ---------- */
function normalizeSvg(svg) {
  let s = svg;
  const styleBlock = (s.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || "";
  const classMap = {};
  for (const m of styleBlock.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]*)\}/g)) {
    const decls = {};
    for (const d of m[2].split(";")) {
      const i = d.indexOf(":");
      if (i > 0) decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
    classMap[m[1]] = decls;
  }
  const resolve = (cls) => {
    const out = {};
    for (const c of cls.trim().split(/\s+/)) Object.assign(out, classMap[c] || {});
    return out;
  };
  s = s.replace(/\sclass="([^"]+)"/g, (m, cls) =>
    Object.entries(resolve(cls)).map(([k, v]) => " " + k + '="' + v + '"').join(""));
  s = s.replace(/<style>[\s\S]*?<\/style>\s*/g, "");
  const rootOpen = s.match(/<svg\b[^>]*>/);
  if (rootOpen) {
    let tag = rootOpen[0];
    if (!/\bwidth=/.test(tag)) tag = tag.replace("<svg", '<svg width="100%" height="100%"');
    if (!/\bheight=/.test(tag)) tag = tag.replace(/width="100%"/, 'width="100%" height="100%"');
    s = s.replace(rootOpen[0], tag);
  }
  s = s.replace(/<\?xml[^>]*\?>\s*/g, "").replace(/<title>[^<]*<\/title>\s*/g, "");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

let designSvg = null, designBmp = null, vb = null;
if (/\.svg$/i.test(designFile)) {
  designSvg = normalizeSvg(fs.readFileSync(designFile, "utf8"));
  const m = designSvg.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/);
  if (!m) { console.error("设计稿缺少 viewBox，无法推算宽高比"); process.exit(1); }
  vb = [+m[1], +m[2]];
  for (const bad of ["`", "${", "\\"]) {
    if (designSvg.includes(bad)) { console.error("设计稿含无法内嵌的字符: " + JSON.stringify(bad)); process.exit(1); }
  }
} else if (/\.(png|jpe?g|webp)$/i.test(designFile)) {
  const buf = fs.readFileSync(designFile);
  if (buf.slice(1, 4).toString("latin1") === "PNG") vb = [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  designBmp = buf.toString("base64");
} else {
  console.error("设计稿只支持 .svg / .png / .jpg / .webp");
  process.exit(1);
}
const aspect = vb ? vb[0] / vb[1] : null;

/* ---------- 填模板 ---------- */
let out = fs.readFileSync(TEMPLATE, "utf8");
out = out.split(PLACEHOLDER).join(name);

if (designSvg) {
  // 不依赖周边注释文本：定位 preview: 后的第一对反引号，替换其中内容
  const pvStart = out.indexOf("  preview:");
  const openTick = pvStart < 0 ? -1 : out.indexOf("`", pvStart);
  const closeTick = openTick < 0 ? -1 : out.indexOf("`", openTick + 1);
  if (pvStart < 0 || openTick < 0 || closeTick < 0) { console.error("模板 preview 段未匹配（模板可能已改动）"); process.exit(1); }
  out = out.slice(0, openTick + 1) + designSvg + out.slice(closeTick);
}
if (aspect) {
  if (!/aspect-ratio:\s*[\d.]+\s*\/\s*[\d.]+;/.test(out)) { console.error("模板 aspect-ratio 未匹配"); process.exit(1); }
  out = out.replace(/aspect-ratio:\s*[\d.]+\s*\/\s*[\d.]+;/, "aspect-ratio: " + vb[0] + " / " + vb[1] + ";");
}
for (const k of ["top", "left", "right", "bottom"]) {
  if (!opts[k]) continue;
  if (!/^-?[\d.]+%$/.test(opts[k])) { console.error("--" + k + " 要写成百分比，如 35%"); process.exit(1); }
  const re = new RegExp("(\\b" + k + ":)\\s*[\\d.]+%");
  if (!re.test(out)) { console.error("模板里找不到 " + k + ":"); process.exit(1); }
  out = out.replace(re, "$1" + opts[k]);
}
const hexToRgb = (hex) => {
  const m = String(hex).replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)].join(",") : null;
};
if (opts["ink-dark"]) out = out.replace(/--ink-dark:#[0-9a-fA-F]{3,8};/, "--ink-dark:" + opts["ink-dark"] + ";");
if (opts["ink-pale"]) {
  out = out.replace(/--ink-pale:#[0-9a-fA-F]{3,8};/, "--ink-pale:" + opts["ink-pale"] + ";");
  if (!opts.rule) { const rgb = hexToRgb(opts["ink-pale"]); if (rgb) out = out.replace(/--tw-rule-rgb:[\d,\s]+;/, "--tw-rule-rgb:" + rgb + ";"); }
}
if (opts.rule) out = out.replace(/--tw-rule-rgb:[\d,\s]+;/, "--tw-rule-rgb:" + opts.rule + ";");

if (designSvg) {
  const b64 = Buffer.from(designSvg).toString("base64");
  out = out.replace(/background-image:url\("TODO:[^"]*"\)/, 'background-image:url("data:image/svg+xml;base64,' + b64 + '")');
} else if (designBmp) {
  const ext = path.extname(designFile).slice(1).toLowerCase().replace("jpg", "jpeg");
  out = out.replace(/background-image:url\("TODO:[^"]*"\)/, 'background-image:url("data:image/' + ext + ';base64,' + designBmp + '")');
}
if (/TODO:粘贴/.test(out)) { console.error("背景图未替换成功"); process.exit(1); }

fs.writeFileSync(target, out);
console.log("已生成 materials/" + name + ".js  (" + (fs.statSync(target).size / 1024).toFixed(1) + "KB)");
if (aspect) console.log("   aspect-ratio: " + vb[0] + " / " + vb[1] + " = " + aspect.toFixed(4));
console.log("   文字编辑区: " + ["top", "left", "right", "bottom"]
  .map(k => k + ":" + ((out.match(new RegExp("\\b" + k + ":([\\d.]+)%")) || [])[1] + "%"))
  .join("  "));

/* ---------- manifest 追加条目 ---------- */
const mf = JSON.parse(fs.readFileSync(MF, "utf8"));
if (mf.materials.some(m => m.id === name)) {
  console.log("manifest 已有 id=" + name + "，未改动 manifest");
} else {
  const w = {};
  new Function("window", out)(w);
  const material = w["__bamboo_material_" + name];
  if (!material) { console.error("生成的文件未导出 __bamboo_material_" + name); process.exit(1); }
  if (material.type !== "paper") { console.error("模板 type 不是 paper: " + material.type); process.exit(1); }
  const author = opts.author || "羽鳞君";
  const desc = opts.desc || ("用户设计的" + name + "主题便签皮肤，拖进画布新建卡片。");
  const entry = {
    id: name,
    name: name,
    type: "paper",
    author: author,
    version: "1.0.0",
    description: desc,
    preview: material.preview,
    url: "https://raw.githubusercontent.com/miaoziguan/bamboo-material-market/main/materials/" + name + ".js",
  };
  if (opts.series) entry.series = opts.series;
  // 插在最后一个 paper 之后，保持 manifest 现有分组顺序
  let at = -1;
  mf.materials.forEach((m, i) => { if (m.type === "paper") at = i; });
  mf.materials.splice(at + 1, 0, entry);
  fs.writeFileSync(MF, JSON.stringify(mf, null, 2) + "\n");
  console.log("已写入 manifest（索引 " + (at + 1) + "，共 " + mf.materials.length + " 个素材）" + (opts.series ? "  series=" + opts.series : ""));
}

/* ---------- 跑闸门 ---------- */
if (opts.noGate) {
  console.log("已跳过闸门（--no-gate）。提交前请手动跑：node scripts/check-materials.js");
  process.exit(0);
}
console.log("\n--- 素材闸门 ---");
try {
  const outLog = execSync("node " + path.join(__dirname, "check-materials.js"), { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  console.log(outLog.trim().split("\n").slice(-6).join("\n"));
  console.log("\n下一步：git add -A && git commit && git push，插件侧刷新素材市场即可看到。");
} catch (e) {
  console.log(((e.stdout || "") + (e.stderr || "")).trim());
  console.log("\n闸门未通过。按上面提示改素材本身；确需豁免时在 scripts/material-check-allow.json 登记理由。");
  console.log("已生成的文件保留在 materials/" + name + ".js，修好后重跑闸门即可。");
  process.exit(1);
}
