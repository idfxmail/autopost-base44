
const fs=require('fs-extra');const path=require('path');const puppeteer=require('puppeteer-extra');const Stealth=require('puppeteer-extra-plugin-stealth');puppeteer.use(Stealth());
const {userPlatformDir}=require('./sessionStore');
async function loginHomeless(user_id,email,password){const dir=userPlatformDir(user_id,'homeless');const cookiesPath=path.join(dir,'cookies.json');
const browser=await puppeteer.launch({headless:'new',args:['--no-sandbox']});const page=await browser.newPage();
try{await page.goto('https://www.homeless.co.il',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1200);const cookies=await page.cookies();
await fs.outputJson(cookiesPath,cookies,{spaces:2});}finally{await browser.close();}return true;} module.exports={loginHomeless};
