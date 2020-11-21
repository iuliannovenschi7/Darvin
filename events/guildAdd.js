const Discord = require('discord.js')
module.exports =async(guild)=> {
    console.log(
        `New guild joined: ${guild.name} (id: ${guild.id}).
         This guild has ${guild.memberCount} members!
         Owner ${guild.owner.user.tag}`
    );
}