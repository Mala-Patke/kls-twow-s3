const { post } = require('axios').default;
require('dotenv').config();

module.exports = function(message){
    post(`https://discord.com/${process.env.WEBHOOK_PATH}`, {
        content:message,
        username:"Sits",
        avatar_url:"https://cdn.discordapp.com/avatars/693587727098314812/d7fcae1f15527bdf3e9b7e24c4b41fa6.webp?size=80"
    }).then(res => console.log(res.status));
}