
require('dotenv').config();
const express=require('express');const crypto=require('crypto');const bodyParser=require('body-parser');const {publish}=require('./publish');
const {initUserSessions}=require('./helpers/sessionStore');
const app=express();app.use(bodyParser.json({limit:'10mb'}));
function verifySignature(req,secret){const sig=req.header('X-Base44-Signature')||'';const payload=JSON.stringify(req.body||{});
const h=crypto.createHmac('sha256',secret).update(payload).digest('hex');if(!sig)return false;try{return crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(h));}catch{return false;}}
app.get('/',(req,res)=>res.send('Autopost Base44 API is up. Use POST /webhook/base44'));
app.post('/webhook/base44',async(req,res)=>{try{const secret=process.env.BASE44_SECRET||'';if(!secret)return res.status(500).json({error:'Missing BASE44_SECRET'});
if(!verifySignature(req,secret))return res.status(401).json({error:'Invalid signature'});const {event='publish_property'}=req.body||{};
if(event==='connect_accounts'){const {user_id,credentials={}}=req.body;if(!user_id)return res.status(400).json({error:'Missing user_id'});
await initUserSessions(user_id,credentials);return res.json({status:'success',message:'Sessions initialized'});} 
if(event==='publish_property'){const {user_id,platform='yad2-rent',property={}}=req.body||{};if(!user_id)return res.status(400).json({error:'Missing user_id'});
if(!property||!property.title)return res.status(400).json({error:'Invalid property payload'});const result=await publish({user_id,platform,property});
return res.json({status:'success',platform,link:result.link,meta:result.meta||null});}return res.status(400).json({error:'Unsupported event'});}catch(err){console.error('Webhook error:',err);
return res.status(500).json({status:'error',message:err.message});}});
const port=process.env.PORT||8080;app.listen(port,()=>console.log(`API listening on ${port}`));
