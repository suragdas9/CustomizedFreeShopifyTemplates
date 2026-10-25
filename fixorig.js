const fs=require('fs');
const { execSync } = require('child_process');
const path=require('path');

const ORIG_ROOT = "C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";

function fixHtml(html){
  // fix broken collection/product images
  html = html.replace(/src="true"/g, 'src="https://placehold.co/300x200"');
  html = html.replace(/data-src="true"/g, 'data-src="https://placehold.co/300x200"');
  // fix payment icons
  const payTokens = ['amazon_payments','bitcoin','maestro','paypal','visa','apple_pay','jcb'];
  for(const t of payTokens){
    const re = new RegExp('src="'+t+'"', 'g');
    html = html.replace(re, 'src="https://placehold.co/60x24?text='+t+'"');
  }
  return html;
}

function compileCss(storeDir){
  const assets = path.join(storeDir,'assets');
  for(const name of ['style','responsive']){
    const scss = path.join(assets, name+'.scss');
    const css = path.join(assets, name+'.scss.css');
    if(fs.existsSync(scss)){
      try {
        execSync('sass "'+scss+'" "'+css+'" --style=expanded', {stdio:'pipe'});
      } catch(e){
        console.error('sass fail', storeDir, name, e.message.slice(0,200));
      }
    }
  }
}

const dirs = fs.readdirSync(ORIG_ROOT,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
let n=0;
for(const d of dirs){
  const storeDir = path.join(ORIG_ROOT, d);
  const htmlPath = path.join(storeDir,'index.html');
  if(!fs.existsSync(htmlPath)) continue;
  // compile
  compileCss(storeDir);
  // fix html
  let html = fs.readFileSync(htmlPath,'utf8');
  html = fixHtml(html);
  fs.writeFileSync(htmlPath, html, 'utf8');
  n++;
  if(n%5===0) console.log('done',n);
}
console.log('Total fixed (original):', n);
