
const fs=require('fs-extra');const path=require('path');const fetch=require('node-fetch');
async function downloadImages(urls=[],tmpDir='./tmp'){await fs.ensureDir(tmpDir);const files=[];
for(let i=0;i<urls.length;i++){const u=urls[i];const ext=(u.split('?')[0].split('.').pop()||'jpg').toLowerCase();
const p=path.join(tmpDir,`img_${Date.now()}_${i}.${ext}`);const res=await fetch(u);if(!res.ok)throw new Error('Failed '+u);
const buf=await res.buffer();await fs.writeFile(p,buf);files.push(p);}return files;} module.exports={downloadImages};
