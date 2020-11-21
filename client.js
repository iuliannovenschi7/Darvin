const { MessageEmbed, version } = require('discord.js');
const botData = require("./database/Client.js");
const bot = new botData();
const Discord = require('discord.js')

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
});


bot.login(process.env.TOKEN);