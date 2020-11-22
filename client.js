const { MessageEmbed, version } = require('discord.js');
const botData = require("./database/bot.js");
const bot = new botData();
const Discord = require('discord.js')
const { Collection } = require("discord.js");
const { prefix, color, owner } = require('./config.json');
const { readdirSync } = require("fs");
const fs = require('fs');
const { join } = require("path");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const ms = require("ms");
const exec = require("child_process").exec;
const { inspect } = require("util");
const clean = text => {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        bot.on(eventName, event.bind(null, bot));
    });
});

const commandFiles = readdirSync(join(__dirname, "cmds")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "cmds", `${file}`));
    bot.commands.set(command.name, command);
}


//joined a server
bot.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    var logm = bot.channels.cache.get("779775995905310750");
    const serverslog = new Discord.MessageEmbed()
        .setTitle("New server :white_check_mark:")
        .setColor(color)
        .addField("Name", `${guild.name}`, true)
        .addField("Has:", `${guild.memberCount} members`, true)
        .setTimestamp()
        .setFooter(`ID: ${guild.id}`);
    logm.send(serverslog)
})

//removed from a server
bot.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    var logm = bot.channels.cache.get("779775995905310750");
    const serverslog = new Discord.MessageEmbed()
        .setTitle("Left server :white_check_mark:")
        .setColor(color)
        .addField("Name", `${guild.name}`, true)
        .addField("Had:", `${guild.memberCount} members`, true)
        .setTimestamp()
        .setFooter(`ID: ${guild.id}`);
    logm.send(serverslog)
})

bot.on('message', async message => {
    console.log(message.content);

    if (message.channel.type === "dm" || message.author.bot || message.author === bot.user) return;

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`(${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!message.content.startsWith(matchedPrefix) || message.author.bot) return;



    /*---------------------------------------------------------------------------*/

    if (commandName === "uptime") {
        if (message.author.id !== "463697446447480832") return;
        var durr = moment
            .duration(bot.uptime)
            .format(" D [days], H [h], m [m], s [s]");

        var upem = new MessageEmbed()
            .setAuthor(`${bot.user.username} | Uptime`, bot.user.displayAvatarURL)
            .setDescription(`${durr}`)
            .setColor(color);
        message.channel.send(upem);
    };

    if (commandName === "stats" || commandName === "about" || commandName === "info" || commandName === "i") {
        if (message.author.id !== "463697446447480832") return;
        const voices = bot.channels.cache.filter(c => c.type === "voice").size;
        const texts = bot.channels.cache.filter(c => c.type === "text").size;
        const catego = bot.channels.cache.filter(c => c.type === "category").size;
        const duration = moment.duration(bot.uptime).format(" D [d], H [h], m [m], s [s]");
        const embed = new MessageEmbed().setAuthor(`${bot.user.username} | Status`, bot.user.displayAvatarURL).setDescription(`
    \n
    Guilds: \`${bot.guilds.cache.size}\` 
    Users: \`${bot.users.cache.size}\`
    
    
    **__Info__**
    Owner:  \`${bot.users.cache.get(owner).tag}\`
    Version:  \`1.0.2\`
    Node.js:  \`${process.version}\`
    Discord.js:  \`v${version}\`
    
    
    
    
    **__Status__**
    Arch: \`${os.arch()}\`
    Platform: \`${os.type()}\`
    Uptime:  \`${duration}\`
    Storage Used:  \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} mb\`
    RAM Usage:  \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} mb\``).setColor(color)
        message.channel.send(embed);
    };

    if (commandName === "e" || commandName === "eval") {
        if (message.author.id !== "463697446447480832") return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            //message.channel.send(clean(evaled), { code: "xl" });
            var eem = new Discord.MessageEmbed()
                .setTitle("Results")
                .addField("Input", `\`\`\`${code}\`\`\``)
                .addField("Output", `\`\`\`${evaled}\`\`\``)
                .setColor(color)
                .setTimestamp();
            message.channel.send(eem)
                .then(eem => {
                    eem.delete(60000)
                })
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }

    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.guildOnly && message.channel.type !== "text") return message.reply("I can't execute that command inside DMs!");
    if (!bot.cooldowns.has(command.name)) {
        bot.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now();
    const timestamps = bot.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(
                `Please wait ${timeLeft.toFixed(1)} more second(s)`).then(message => message.delete(5000));
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(error);
    }








});


bot.login(process.env.TOKEN);