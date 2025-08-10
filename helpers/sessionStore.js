
const fs=require('fs-extra');const path=require('path');const {loginYad2}=require('./yad2Login');const {loginHomeless}=require('./homelessLogin');
const SESSION_DIR=process.env.SESSION_DIR||'./cookies';function userPlatformDir(user_id,platform){return path.join(SESSION_DIR,String(user_id),platform);}
async function initUserSessions(user_id,credentials={}){await fs.ensureDir(userPlatformDir(user_id,'yad2'));await fs.ensureDir(userPlatformDir(user_id,'homeless'));
if(credentials.yad2_email&&credentials.yad2_password){await loginYad2(user_id,credentials.yad2_email,credentials.yad2_password);}
if(credentials.homeless_email&&credentials.homeless_password){await loginHomeless(user_id,credentials.homeless_email,credentials.homeless_password);}return true;}
module.exports={userPlatformDir,initUserSessions};
