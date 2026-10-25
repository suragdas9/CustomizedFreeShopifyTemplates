const fs=require('fs');
const { execSync } = require('child_process');
const path=require('path');

const ORIG_ROOT = "C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";

function preprocessScss(src){
  src = src.replace(/\{\{[^}]*\}\}/g, '');
  src = src.replace(/\{%-?[^%]*-?%\}/g, '');
  src = src.replace(/@media\(/g, '@media (');
  src = src.replace(/and\(/g, 'and (');
  src = src.replace(/@extend\s+(\.[A-Za-z0-9_-]+):([A-Za-z-]+)\s*;/g, '@extend $1, :$2;');
  src = src.replace(/calc\(([^)]+)\)/g, (m, inner) => {
    let v = inner.replace(/\s*([\/\*\+\-])\s*/g, ' $1 ');
    return 'calc(' + v + ')';
  });
  return src;
}

function compileAllScss(storeDir){
  const assets = path.join(storeDir,'assets');
  if(!fs.existsSync(assets)) return;
  const files = fs.readdirSync(assets).filter(f=>f.endsWith('.scss') && !f.startsWith('_tmp_'));
  for(const f of files){
    const scss = path.join(assets, f);
    const css = path.join(assets, f+'.css');
    const orig = fs.readFileSync(scss,'utf8');
    const processed = preprocessScss(orig);
    const tmp = path.join(assets, '_tmp_'+f);
    fs.writeFileSync(tmp, processed, 'utf8');
    try {
      execSync('sass "'+tmp+'" "'+css+'" --style=expanded --quiet-deps', {stdio:'pipe'});
    } catch(e){
      if(fs.existsSync(css)) {
        const content = fs.readFileSync(css,'utf8');
        if(content.includes('Error:')) fs.unlinkSync(css);
      }
    } finally {
      if(fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }
  }
}

function fixHtml(html){
  html = html.replace(/src="true"/g, 'src="https://placehold.co/300x200"');
  html = html.replace(/data-src="true"/g, 'data-src="https://placehold.co/300x200"');
  const payTokens = ['amazon_payments','bitcoin','maestro','paypal','visa','apple_pay','jcb'];
  for(const t of payTokens){
    const re = new RegExp('src="'+t+'"', 'g');
    html = html.replace(re, 'src="https://placehold.co/60x24?text='+t+'"');
  }
  return html;
}

const dirs = fs.readdirSync(ORIG_ROOT,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
let n=0;
for(const d of dirs){
  const storeDir = path.join(ORIG_ROOT, d);
  const htmlPath = path.join(storeDir,'index.html');
  if(!fs.existsSync(htmlPath)) continue;
  compileAllScss(storeDir);
  let html = fs.readFileSync(htmlPath,'utf8');
  html = fixHtml(html);
  fs.writeFileSync(htmlPath, html, 'utf8');
  n++;
}
console.log('Total fixed (original):', n);
