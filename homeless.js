
const fs=require('fs-extra');const path=require('path');const puppeteer=require('puppeteer-extra');const Stealth=require('puppeteer-extra-plugin-stealth');puppeteer.use(Stealth());
const {userPlatformDir}=require('../helpers/sessionStore');const {downloadImages}=require('../utils/downloadImages');const sel=require('../selectorMaps/homeless.json');
async function withCookies(page,p){if(await fs.pathExists(p)){const c=await fs.readJson(p);await page.setCookie(...c);}}
module.exports=async function({user_id,property}){const dir=userPlatformDir(user_id,'homeless');const cookiesPath=path.join(dir,'cookies.json');
const browser=await puppeteer.launch({headless:'new',args:['--no-sandbox']});const page=await browser.newPage();
try{await page.goto(sel.publish_url,{waitUntil:'domcontentloaded'});await withCookies(page,cookiesPath);await page.reload({waitUntil:'networkidle2'});
if(sel.title)await page.$eval(sel.title,(el)=>{el.value='';el.focus();});await page.type(sel.title,property.title||'',{delay:12}).catch(()=>{});
if(sel.address)await page.type(sel.address,property.address||'',{delay:12}).catch(()=>{});
if(sel.price)await page.type(sel.price,String(property.price||''),{delay:12}).catch(()=>{});
if(sel.rooms)await page.type(sel.rooms,String(property.rooms||''),{delay:12}).catch(()=>{});
if(sel.floor)await page.type(sel.floor,String(property.floor||''),{delay:12}).catch(()=>{});
if(sel.size)await page.type(sel.size,String(property.size||''),{delay:12}).catch(()=>{});
if(sel.description)await page.type(sel.description,property.description||'',{delay:10}).catch(()=>{});
const imgs=await downloadImages(property.images||[],'./tmp');for(const p of imgs){const input=await page.$(sel.image_input);if(input)await input.uploadFile(p);await page.waitForTimeout(400);}
await page.click(sel.publish_button).catch(()=>{});await page.waitForNavigation({waitUntil:'networkidle2',timeout:60000}).catch(()=>{});
await page.goto(sel.my_ads_url,{waitUntil:'networkidle2'});const link=await page.evaluate(()=>{const a=document.querySelector('a[href*="ad"]')||document.querySelector('a[href*="/ad/"]');return a?a.href:null;});
return {link:link||'PUBLISHED_NO_LINK_FOUND',meta:{platform:'homeless'}};} finally{await browser.close();}}
