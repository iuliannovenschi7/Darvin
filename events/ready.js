const Discord = require('discord.js')
module.exports = (bot, ready) => {
    bot.user.setStatus("online");
    bot.user.setActivity(`Wild Rift`)
    console.log(bot.user.username + " is online and ready");
    var logm = bot.channels.get("627162373156896778");
    logm.send("online");
}