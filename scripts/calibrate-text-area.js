#!/usr/bin/env node
/**
 * calibrate-text-area.js — 文字编辑区可视化标定工具
 *
 * 解决「文字区 4 个百分比靠手算」的问题：生成一个自包含 HTML 预览页，
 * 设计图上叠一个可拖拽/可缩放的框，实时输出 top/left/right/bottom，
 * 一键复制成 .tw-card-text 的 CSS。
 *
 * 用法：
 *   node scripts/calibrate-text-area.js <设计稿.svg>            # 输出到 /tmp
 *   node scripts/calibrate-text-area.js <设计稿.svg> out.html   # 指定输出
 *   node scripts/calibrate-text-area.js --material 好好吃饭      # 直接用已上架素材的背景图
 *
 * 生成的 HTML 用浏览器打开即可（零依赖、可离线）。支持：
 *   · 拖动红框移动；拖 8 个手柄缩放；方向键微调（先点一下红框）
 *   · 数值按 0.5% 对齐；实时显示可粘贴的 CSS
 */
'use strict';
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..");

/* ---------- 取设计稿（SVG 文件或已上架素材的背景图） ---------- */
const argv = process.argv.slice(2);
let label = "", art = "", vb = null;

if (argv[0] === "--material") {
  const id = argv[1];
  if (!id) { console.error("用法: node scripts/calibrate-text-area.js --material <素材id>"); process.exit(1); }
  const p = path.join(ROOT, "materials", id + ".js");
  if (!fs.existsSync(p)) { console.error("找不到素材: " + p); process.exit(1); }
  const w = {};
  new Function("window", fs.readFileSync(p, "utf8"))(w);
  const css = w["__bamboo_material_" + id].css();
  label = id;
  // 背景图可能是 base64 SVG / URL 编码 SVG，也可能是 PNG/JPEG 位图——三者都支持
  let svgText = null;
  const sb = (css.match(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/) || [])[1];
  if (sb) { try { svgText = Buffer.from(sb, "base64").toString("utf8"); } catch (e) {} }
  if (!svgText) {
    const su = (css.match(/data:image\/svg\+xml;charset=utf-8,([^"']+)/) || [])[1];
    if (su) { try { svgText = decodeURIComponent(su); } catch (e) {} }
  }
  const bmpM = css.match(/data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)/);
  if (svgText) {
    const svg = svgText;
    const m = (svg.match(/viewBox\s*=\s*["\x27]\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/) || []).slice(1).map(Number);
    if (m.length === 2) {
      vb = m;
      art = svg.replace(/<svg\b([^>]*)>/, (t, a) => "<svg" + a.replace(/\s(width|height)="[^"]*"/g, "") + ">");
    }
  }
  if (!art && bmpM) {
    const buf = Buffer.from(bmpM[2], "base64");
    if (bmpM[1] === "png" && buf.slice(1, 4).toString("latin1") === "PNG") vb = [buf.readUInt32BE(16), buf.readUInt32BE(20)];
    else vb = [1, 1];
    art = '<img src="data:image/' + bmpM[1] + ';base64,' + bmpM[2] + '" style="width:100%;height:100%;display:block" alt="">';
  }
  if (!art) { console.error("该素材没有可用的背景图（既非 base64 SVG 也非位图）"); process.exit(1); }
} else {
  const f = argv[0];
  if (!f || !fs.existsSync(f)) {
    console.error("用法:");
    console.error("  node scripts/calibrate-text-area.js <设计稿.svg> [out.html]");
    console.error("  node scripts/calibrate-text-area.js --material <素材id>");
    process.exit(1);
  }
  const svg = fs.readFileSync(f, "utf8");
  label = path.basename(f).replace(/\.svg$/i, "");
  const m = (svg.match(/viewBox\s*=\s*["\x27]\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/) || []).slice(1).map(Number);
  if (m.length !== 2) { console.error("设计稿缺少 viewBox"); process.exit(1); }
  vb = m;
  // 根尺寸交给外层 frame 控制，去掉 SVG 自身尺寸声明避免冲突
  art = svg.replace(/<svg\b([^>]*)>/, (t, a) => "<svg" + a.replace(/\s(width|height)="[^"]*"/g, "") + ">");
}

const outFile = (argv[0] === "--material" ? argv[2] : argv[1])
  || path.join(os.tmpdir(), "calibrate-" + label + ".html");

fs.writeFileSync(outFile, buildHtml(label, vb, art));
console.log("已生成标定页: " + outFile);
console.log("  设计尺寸: " + vb[0] + " x " + vb[1] + "   宽高比 " + (vb[0] / vb[1]).toFixed(4));
console.log("\n用浏览器打开它，拖动红框到设计图上可写字的区域，右侧会实时给出 CSS。");

function buildHtml(name, vb, svgBody) {
  const W = vb[0], H = vb[1];
  return [
"<!DOCTYPE html>",
'<html lang="zh-CN"><head><meta charset="utf-8">',
"<title>文字区标定 · " + name + "</title>",
"<style>",
"*{box-sizing:border-box}",
"body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;background:#f4f2ed;color:#231815;height:100vh;display:flex;flex-direction:column}",
"header{padding:14px 20px;background:#fff;border-bottom:1px solid #e6e2da;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}",
"header h1{font-size:15px;margin:0;font-weight:700}",
"header .meta{font-size:12px;color:#8c857c}",
"main{flex:1;display:flex;min-height:0}",
"#stage{flex:1;display:flex;align-items:center;justify-content:center;padding:28px;overflow:hidden}",
"#frame{position:relative;background:#fff;box-shadow:0 10px 44px rgba(35,24,21,.22);user-select:none}",
"#frame .art{position:absolute;inset:0}",
"#frame .art svg{display:block;width:100%;height:100%}",
"#box{position:absolute;border:2px dashed #e02020;background:rgba(224,32,32,.05);cursor:move;touch-action:none}",
"#box .lbl{position:absolute;left:0;top:-22px;font-size:11px;color:#e02020;white-space:nowrap;font-weight:600}",
".h{position:absolute;width:13px;height:13px;background:#e02020;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.3)}",
".h.nw{left:-8px;top:-8px;cursor:nwse-resize}.h.ne{right:-8px;top:-8px;cursor:nesw-resize}",
".h.sw{left:-8px;bottom:-8px;cursor:nesw-resize}.h.se{right:-8px;bottom:-8px;cursor:nwse-resize}",
".h.n{left:50%;margin-left:-6px;top:-8px;cursor:ns-resize}.h.s{left:50%;margin-left:-6px;bottom:-8px;cursor:ns-resize}",
".h.w{top:50%;margin-top:-6px;left:-8px;cursor:ew-resize}.h.e{top:50%;margin-top:-6px;right:-8px;cursor:ew-resize}",
"#panel{width:336px;background:#fff;border-left:1px solid #e6e2da;padding:20px;overflow:auto}",
"#panel h2{font-size:13px;margin:0 0 12px;color:#8c857c;font-weight:600;letter-spacing:.04em}",
".row{display:flex;align-items:center;gap:10px;margin-bottom:9px}",
".row label{width:64px;font-size:13px;color:#231815;font-weight:600}",
".row input{flex:1;font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;padding:6px 9px;border:1px solid #d9d4cb;border-radius:6px;background:#fbfaf7}",
".row input:focus{outline:none;border-color:#e02020}",
"pre{margin:14px 0 0;padding:12px;background:#231815;color:#f4f2ed;border-radius:8px;font:12px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-all}",
"button{font:13px/1 inherit;padding:8px 14px;border:1px solid #d9d4cb;background:#fff;border-radius:7px;cursor:pointer;color:#231815}",
"button:hover{background:#f4f2ed}",
"button.primary{background:#231815;color:#fff;border-color:#231815}",
"button.primary:hover{background:#3d332e}",
".btns{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}",
".tip{margin-top:16px;font-size:12px;color:#8c857c;line-height:1.7}",
".tip b{color:#231815}",
"</style></head><body>",
"<header><h1>文字编辑区标定</h1><span class='meta'>" + name + " &nbsp;·&nbsp; viewBox " + W + " × " + H + " &nbsp;·&nbsp; 宽高比 " + (W / H).toFixed(4) + "</span></header>",
"<main><div id='stage'><div id='frame'>",
"<div class='art'>" + svgBody + "</div>",
"<div id='box'><span class='lbl' id='lbl'></span>",
"<div class='h nw' data-h='nw'></div><div class='h n' data-h='n'></div><div class='h ne' data-h='ne'></div>",
"<div class='h w' data-h='w'></div><div class='h e' data-h='e'></div>",
"<div class='h sw' data-h='sw'></div><div class='h s' data-h='s'></div><div class='h se' data-h='se'></div>",
"</div></div></div>",
"<div id='panel'>",
"<h2>编辑区边界（相对卡片 %）</h2>",
"<div class='row'><label>top</label><input id='i-top' value='35'></div>",
"<div class='row'><label>right</label><input id='i-right' value='18.5'></div>",
"<div class='row'><label>bottom</label><input id='i-bottom' value='15'></div>",
"<div class='row'><label>left</label><input id='i-left' value='18.5'></div>",
"<div class='btns'><button class='primary' id='copy'>复制 CSS</button><button id='reset'>重置</button></div>",
"<pre id='css'></pre>",
"<div class='tip'><b>用法：</b>拖动红框移动，拖 8 个圆点缩放；也可直接改左侧数值（支持小数，按 0.5 对齐）。<br>",
"复制后贴到素材 <b>css()</b> 的 <b>.tw-card-text</b> 规则里。<br>",
"<b>提醒：</b>不要在 .tw-card-text 里写 font-size——字号由主题 var(--tw-fs-base) 联动 A↑A↓，写死即使调节失效。</div>",
"</div></main>",
"<script>",
"(function(){",
"var frame=document.getElementById('frame'),box=document.getElementById('box'),lbl=document.getElementById('lbl');",
"var VBW=" + W + ",VBH=" + H + ";",
"var S={top:35,right:18.5,bottom:15,left:18.5};",
"var ins={top:document.getElementById('i-top'),right:document.getElementById('i-right'),bottom:document.getElementById('i-bottom'),left:document.getElementById('i-left')};",
"function fit(){",
"  var st=document.getElementById('stage');",
"  var mw=st.clientWidth-56,mh=st.clientHeight-56;",
"  var fw=mw,fh=fw*VBH/VBW;",
"  if(fh>mh){fh=mh;fw=fh*VBW/VBH;}",
"  frame.style.width=fw+'px';frame.style.height=fh+'px';",
"}",
"function snap(v){return Math.round(v*2)/2;}",
"function clamp(v){return Math.max(0,Math.min(100,v));}",
"function apply(){",
"  box.style.top=S.top+'%';box.style.left=S.left+'%';",
"  box.style.right=S.right+'%';box.style.bottom=S.bottom+'%';",
"  lbl.textContent='top '+S.top+'% · right '+S.right+'% · bottom '+S.bottom+'% · left '+S.left+'%';",
"  ins.top.value=S.top;ins.right.value=S.right;ins.bottom.value=S.bottom;ins.left.value=S.left;",
"  document.getElementById('css').textContent=",
"    '.tw-card-text{position:absolute; top:'+S.top+'%; left:'+S.left+'%; right:'+S.right+'%; bottom:'+S.bottom+'%; color:#1a1a1a; text-align:center; z-index:2; overflow:auto;}';",
"}",
"function readIns(){",
"  ['top','right','bottom','left'].forEach(function(k){",
"    var v=parseFloat(ins[k].value);",
"    if(!isNaN(v)) S[k]=clamp(snap(v));",
"  });",
"  apply();",
"}",
"Object.keys(ins).forEach(function(k){ins[k].addEventListener('input',readIns);});",
"document.getElementById('reset').addEventListener('click',function(){S={top:35,right:18.5,bottom:15,left:18.5};apply();});",
"document.getElementById('copy').addEventListener('click',function(){",
"  var t=document.getElementById('css').textContent;",
"  var b=this;",
"  function ok(){b.textContent='已复制';setTimeout(function(){b.textContent='复制 CSS';},1400);}",
"  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){fb(t);ok();});}",
"  else{fb(t);ok();}",
"});",
"function fb(t){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);}",
"/* ---- 拖拽与缩放 ---- */",
"var drag=null;",
"function pct(e){",
"  var r=frame.getBoundingClientRect();",
"  var cx=(e.touches?e.touches[0].clientX:e.clientX),cy=(e.touches?e.touches[0].clientY:e.clientY);",
"  return {x:(cx-r.left)/r.width*100,y:(cy-r.top)/r.height*100};",
"}",
"function start(e,h){",
"  e.preventDefault();e.stopPropagation();",
"  var p=pct(e);",
"  drag={h:h,x0:p.x,y0:p.y,s0:{top:S.top,right:S.right,bottom:S.bottom,left:S.left}};",
"}",
"function move(e){",
"  if(!drag)return;",
"  var p=pct(e),dx=p.x-drag.x0,dy=p.y-drag.y0,o=drag.s0;",
"  var h=drag.h;",
"  if(h==='move'){",
"    S.top=clamp(snap(o.top+dy));S.bottom=clamp(snap(o.bottom-dy));",
"    S.left=clamp(snap(o.left+dx));S.right=clamp(snap(o.right-dx));",
"  }else{",
"    if(h.indexOf('n')>=0)S.top=clamp(snap(o.top+dy));",
"    if(h.indexOf('s')>=0)S.bottom=clamp(snap(o.bottom-dy));",
"    if(h.indexOf('w')>=0)S.left=clamp(snap(o.left+dx));",
"    if(h.indexOf('e')>=0)S.right=clamp(snap(o.right-dx));",
"    if(S.top+S.bottom>95){ if(h.indexOf('n')>=0)S.top=95-S.bottom; else S.bottom=95-S.top; }",
"    if(S.left+S.right>95){ if(h.indexOf('w')>=0)S.left=95-S.right; else S.right=95-S.left; }",
"  }",
"  apply();",
"}",
"function end(){drag=null;}",
"box.addEventListener('mousedown',function(e){if(e.target.classList.contains('h'))return;start(e,'move');});",
"box.addEventListener('touchstart',function(e){if(e.target.classList.contains('h'))return;start(e,'move');},{passive:false});",
"Array.prototype.forEach.call(document.querySelectorAll('.h'),function(el){",
"  var h=el.getAttribute('data-h');",
"  el.addEventListener('mousedown',function(e){start(e,h);});",
"  el.addEventListener('touchstart',function(e){start(e,h);},{passive:false});",
"});",
"window.addEventListener('mousemove',move);window.addEventListener('touchmove',move,{passive:false});",
"window.addEventListener('mouseup',end);window.addEventListener('touchend',end);",
"/* 方向键微调 */",
"box.tabIndex=0;",
"box.addEventListener('keydown',function(e){",
"  var k=e.key,st=0.5;",
"  if(k==='ArrowUp'){S.top=clamp(snap(S.top-st));}else if(k==='ArrowDown'){S.top=clamp(snap(S.top+st));}",
"  else if(k==='ArrowLeft'){S.left=clamp(snap(S.left-st));}else if(k==='ArrowRight'){S.left=clamp(snap(S.left+st));}",
"  else return;",
"  e.preventDefault();apply();",
"});",
"fit();apply();",
"window.addEventListener('resize',fit);",
"})();",
"</" + "script></body></html>"
  ].join("\n");
}
