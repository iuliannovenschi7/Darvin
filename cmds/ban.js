const Discord = require('discord.js');
const bot = require("discord.js");

module.exports = {
  name: "ban",
  aliases: ["ban"],
  description: "ban",
  args: true,
  cooldown: 5,
  async execute(message, args, color) {
    if (!message.member.hasPermission("BAN_MEMBERS") || !message.author.id === "463697446447480832")
      return message.channel.send(
        "You don't have permissions to use this!"
      );
    if (!args.length) return message.channel.send("Give me an ID ");
    //	var target = message.author;
    var member = message.guild.members.fetch(args[0]);
    if (args[0] === "779426058583408661") return;
    if (!member) return message.channel.send("That user doesn't exist or he is not in this server");
    if (args[0] === "463697446447480832") return;
    if (!member.bannable)
      return message.channel.send(
        "My roles are not high enough or i don't have `BAN MEMBERS` permission to ban this user!"
      );
    if (member.id === message.author.id)
      return message.channel.send("You can't ban yourself");
    let reason = args.slice(1).join(" ");
    if (!reason) {
      res = "No reason given";
    } else {
      res = reason;
    }
    await member
      .ban(reason)
      .catch(error => console.log(error));
    let flo = message.guild.channels.cache.get("779775995905310750");
    let bean = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle('Ban')
      .addField("User", `${member.user.tag}`, true)
      .addField("Moderator", message.author.tag, true)
      .addField("Reason", res)
      .setFooter(`User ID: ${member.id}`)
      .setTimestamp();
    flo.send(bean);
    message.delete();
  }
};
