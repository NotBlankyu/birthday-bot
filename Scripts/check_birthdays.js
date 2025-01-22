const {get_birthdays_on_day,get_server} = require("../util/db.js")
const { Client, Events, GatewayIntentBits, Collection, MessageFlags, EmbedBuilder } = require('discord.js');

require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');

const discord_token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

var server_channel_dict = new Map()

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    var day = new Date();
    var day = `${day.getDate()}/${day.getMonth()+1}}`
    //var day= "21/8"
    var birthdays = await get_birthdays_on_day(day)
    for (const user of birthdays) {
        const ids = user.split("/")
        var channel_id = server_channel_dict.get(ids[0])
        if(channel_id == null){
            var _user = await readyClient.users.fetch(ids[1])
            await get_server(ids[0]).then(server => {
                server_channel_dict.set(ids[0],server.channel_pings_id)
                readyClient.channels.fetch(server.channel_pings_id).then(channel => {
                    const embed = new EmbedBuilder()
                    .setColor(0xeb9534)
                    .setTitle(`Happy birthday!!!!`)
                    .setDescription(`Today is <@${ids[1]}> birthday!!!`)
                    .setImage(_user.avatarURL({ format: 'jpg', size: 1024 }))
                    if(server.role_id){
                        channel.send({content:`<@&${server.role_id}>`,embeds:[embed]})
                    }else{
                        channel.send({embeds:[embed]})
                    }
                    
                }).catch(console.error);
            })
            
        }else{
            var _user = await readyClient.users.fetch(ids[1])
            
            readyClient.channels.fetch(channel_id).then(channel => {
                const embed = new EmbedBuilder()
                .setColor(0xeb9534)
                .setTitle(`Happy birthday <@${ids[1]}>!!!`)
                .setImage(_user.avatarURL())
                if(server.role_id){
                    channel.send({content:`<@&${server.role_id}>`,embeds:[embed]})
                }else{
                    channel.send({embeds:[embed]})
                }
                //channel.send({files:[_user.avatarURL()]})
            })
                .catch(console.error);
        }
        
    }
    
});

client.login(discord_token);