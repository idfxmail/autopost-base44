
const crypto=require('crypto');const fs=require('fs');const secret=process.env.BASE44_SECRET||'CHANGE_ME';
const payload=fs.readFileSync('./sample.json','utf8');const sig=crypto.createHmac('sha256',secret).update(payload).digest('hex');console.log(sig);
