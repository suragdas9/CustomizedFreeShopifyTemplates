const fs=require('fs');
const base="C:/Users/surag/OneDrive/Desktop/Ecommerce Store Prebuilt Templates/Shopify Templates -20261025T063817Z-1-001/Shopify Templates/Index html Files";
const dirs=fs.readdirSync(base,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
let srcTrue=0, scssCss=0;
const paySet=new Set();
let stores=0;
for(const d of dirs){
  const p=base+'/'+d+'/index.html';
  if(!fs.existsSync(p)) continue;
  stores++;
  const s=fs.readFileSync(p,'utf8');
  srcTrue += (s.match(/src="true"/g)||[]).length;
  scssCss += (s.match(/scss\.css/g)||[]).length;
  const m=s.match(/src="[a-z_]+"/g)||[];
  for(const x of m){ paySet.add(x); }
}
console.log('stores with index.html',stores);
console.log('src=true total',srcTrue);
console.log('scss.css refs total',scssCss);
console.log('unique short src tokens:', [...paySet].join(', '));
