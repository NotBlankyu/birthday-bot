const {get_birthdays_on_day,get_server} = require("../util/db.js")
const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');

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
    var birthdays = await get_birthdays_on_day(day)
    for (const user of birthdays) {
        const ids = user.split("/")
        var channel_id = server_channel_dict.get(ids[0])
        if(channel_id == null){
            await get_server(ids[0]).then(server => {
                server_channel_dict.set(ids[0],server.channel_id)
                readyClient.channels.fetch(server.channel_id).then(channel =>  channel.send(`Happy birthday <@${ids[1]}>!!!`))
                .catch(console.error);
            })
            
        }else{
            readyClient.channels.fetch(channel_id).then(channel => channel.send(`Happy birthday <@${ids[1]}>!!!`))
                .catch(console.error);
        }
        
    }
    
});

client.login(discord_token);