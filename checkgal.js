const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const re=/src="\.\/templates\/([^\/]+)\/screenshot\.png"/g;
let m, missing=0, total=0;
while((m=re.exec(html))){
  total++;
  const p='./templates/'+m[1]+'/screenshot.png';
  if(!fs.existsSync(p)){ missing++; console.log('MISSING',p); }
}
console.log('total screenshot refs',total,'missing',missing);
