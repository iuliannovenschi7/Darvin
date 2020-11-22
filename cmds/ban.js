const Discord = require('discord.js');
module.exports = {
  name: "ban",
  aliases: ["ban"],
  description: "ban",
  args: true,
  cooldown: 5,
  async execute(message, args, color, bot) {
    if (!message.member.permission.has("BAN_MEMBERS") || !message.author.id === "463697446447480832")
      return message.channel.send(
        "You don't have permissions to use this!"
      );
    if (!args.length) return message.channel.send("Give me an ID or mention someone first");
    //	var target = message.author;
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send("That user doesn't exist or he is not in this server");
    if (member.id === "463697446447480832") return;
    if (!member.bannable)
      return message.channel.send(
        "My roles are not high enough or i don't have `BAN_MEMBERS` permission to ban this user!"
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
      .catch(error =>
        message.channel.send(`Sorry, I coldn't ban because of: ${error}`)
      );
    let flo = bot.channels.cache.get("779775995905310750");
    let bean = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle('Ban')
      .addField("User", `${member.user.tag}`, true)
      .addField("Moderator", message.author.tag, true)
      .addField("Reason", res)
      .setFooter(`ID: ${member.id}`)
      .setTimestamp();
    flo.send(bean);
    message.delete();
  }
};
