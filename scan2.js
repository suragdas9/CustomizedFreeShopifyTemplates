const fs=require('fs');
const base="C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";
const dirs=fs.readdirSync(base,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
for(const d of dirs){
  const p=base+'/'+d+'/index.html';
  if(!fs.existsSync(p)) continue;
  const s=fs.readFileSync(p,'utf8');
  if(s.includes('___product_image___')){
    const i=s.indexOf('___product_image___');
    console.log('==',d);
    console.log(s.slice(Math.max(0,i-80), i+80));
    break;
  }
}
