const fs=require('fs');
const base="C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";
const dirs=fs.readdirSync(base,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
let bad=0, good=0, missing=0;
for(const d of dirs){
  for(const n of ['style','responsive']){
    const p=base+'/'+d+'/assets/'+n+'.scss.css';
    if(!fs.existsSync(p)){ missing++; continue; }
    const s=fs.readFileSync(p,'utf8').slice(0,60);
    if(s.includes('Error:')) { bad++; console.log('BAD',d,n); }
    else good++;
  }
}
console.log('good',good,'bad',bad,'missing',missing);
