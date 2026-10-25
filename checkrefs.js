const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const re=/(?:src|href)=["']([^"']+)["']/g;
let m; const set=new Set();
while((m=re.exec(html))){set.add(m[1]);}
const miss=[];
for(const p of set){
  if(p.startsWith('http')||p.startsWith('shopify:')||p.startsWith('#')||p.startsWith('//')) continue;
  const clean=p.split('?')[0];
  if(!fs.existsSync(clean)) miss.push(p);
}
console.log('total refs:',set.size,'missing:',miss.length);
console.log(miss.join('\n'));
