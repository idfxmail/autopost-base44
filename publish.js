
const fs=require('fs-extra');
const platforms={'yad2-rent':require('./platforms/yad2-rent'),'yad2-sale':require('./platforms/yad2-sale'),'homeless':require('./platforms/homeless'),'facebook':require('./platforms/facebook')};
async function publish({user_id,platform,property}){if(!platforms[platform])throw new Error(`Unsupported platform: ${platform}`);
await fs.ensureDir(process.env.SESSION_DIR||'./cookies');return await platforms[platform]({user_id,property});}
module.exports={publish};
