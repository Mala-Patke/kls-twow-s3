const https = require('https');
require('dotenv').config();

module.exports = function(message){
    let data = new TextEncoder().encode(
        JSON.stringify({
            content:message,
            username:"Sits",
            avatar_url:"https://cdn.discordapp.com/avatars/693587727098314812/dbe5fac3376999be0f51d229fdb311b9.webp?size=80"
        })
    );
    
    let req = https.request({
        hostname: 'discord.com',
        path: process.env.WEBHOOK_PATH,
        method: "POST",
        headers: {
            'Content-Type':'application/json',
            'Content-Length':data.length
        }
    }, res => {
        console.log(res.statusCode);
    });


    req.on('error', console.error);
    req.write(data);
    req.end();
}