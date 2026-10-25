const fs=require('fs');
const { execSync } = require('child_process');
const path=require('path');

const ORIG_ROOT = "C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";

function compileAllScss(storeDir){
  const assets = path.join(storeDir,'assets');
  if(!fs.existsSync(assets)) return;
  const files = fs.readdirSync(assets).filter(f=>f.endsWith('.scss'));
  for(const f of files){
    const scss = path.join(assets, f);
    const css = path.join(assets, f+'.css');
    if(fs.existsSync(css) && fs.statSync(css).mtimeMs > fs.statSync(scss).mtimeMs) continue;
    try {
      execSync('sass "'+scss+'" "'+css+'" --style=expanded --quiet-deps', {stdio:'pipe'});
    } catch(e){
      // try to capture error
      const msg = (e.stderr||e.stdout||'').toString().slice(0,120).replace(/\n/g,' ');
      console.error('FAIL', storeDir.split('/').pop(), f, msg);
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
