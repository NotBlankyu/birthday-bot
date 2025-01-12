const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const { discord_token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const commandsFolderPath = path.join(__dirname, "commands");
const commandsFolder = fs.readdirSync(commandsFolderPath);

for (const folder of commandsFolder){
	const commandsPath = path.join(commandsFolderPath,folder);
	commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles){
		const filePath = path.join(commandsPath,file);
		const command  = require(filePath);

		if ('data' in command && 'execute' in command){
			console.log(`Added command ${command.data.name}`)
			client.commands.set(command.data.name,command);
		}else{
			console.log(`Command at ${filePath} is missing data or execute property`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command){
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try{
		await command.execute(interaction);
	}catch (error){
		console.error(error)
		if(interaction.replied || interaction.deferred){
			await interaction.followUp({content: `There was an error with this command`,flags:MessageFlags.Ephemeral})
		}else{
			await interaction.reply({content: `There was an error with this command`,flags:MessageFlags.Ephemeral})
		}
	}
})





client.login(discord_token);
