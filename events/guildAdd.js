const Discord = require('discord.js')
module.exports = (bot, guild) => {
    console.log(
        `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
    );
    var logm = bot.channels.cache.get("779775995905310750");
    const serverslog = new Discord.MessageEmbed()
        .setTitle("New server :white_check_mark:")
        .setColor('GREEN')
        .addField("Name", `${guild.name}`, true)
        .addField("Has:", `${guild.memberCount} members`, true)
        .addField("owner:", `${guild.owner.user.tag}`, true)
        .setTimestamp()
        .setFooter(`ID: ${guild.id}`);
    logm.send(serverslog)
}