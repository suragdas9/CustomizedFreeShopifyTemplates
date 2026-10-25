const fs=require('fs');
const base="C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";
const dirs=fs.readdirSync(base,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
for(const d of dirs.slice(0,3)){
  const p=base+'/'+d+'/assets/style.scss.css';
  console.log(d, fs.existsSync(p));
}
