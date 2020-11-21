const Discord = require('discord.js')
module.exports = (bot, ready) => {
    bot.user.setStatus("online");
    bot.user.setActivity(`Wild Rift`)
    console.log(bot.user.username + " is online and ready");
}