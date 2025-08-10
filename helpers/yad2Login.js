
const fs=require('fs-extra');const path=require('path');const puppeteer=require('puppeteer-extra');const Stealth=require('puppeteer-extra-plugin-stealth');puppeteer.use(Stealth());
const {userPlatformDir}=require('./sessionStore');
async function loginYad2(user_id,email,password){const dir=userPlatformDir(user_id,'yad2');const cookiesPath=path.join(dir,'cookies.json');
const browser=await puppeteer.launch({headless:'new',args:['--no-sandbox']});const page=await browser.newPage();
try{await page.goto('https://www.yad2.co.il/realestate/rent',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1200);
await page.evaluate(()=>{const el=document.querySelector('[data-test="header-login"],[data-testid="header-login"]');if(el)el.click();});
await page.waitForTimeout(1200);await page.type('input[type="email"],input[name="email"]',email,{delay:20});
await page.type('input[type="password"],input[name="password"]',password,{delay:20});await page.click('button[type="submit"],button[data-test="submit"],button[data-testid="submit"]').catch(()=>{});
await page.waitForNavigation({waitUntil:'networkidle2',timeout:30000}).catch(()=>{});const cookies=await page.cookies();await fs.outputJson(cookiesPath,cookies,{spaces:2});}
finally{await browser.close();}return true;} module.exports={loginYad2};
