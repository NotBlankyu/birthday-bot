const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const {delete_birthday,get_server} = require("../../util/db.js");
const {manage_message} = require("../../util/manage_list.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove-birthday')
		.setDescription('Remove your birthday from the list')
        ,
	async execute(interaction) {
        await interaction.deferReply()
        let result = await delete_birthday(interaction.guildId,interaction.user.id)
        if (result){
            let server_info = await get_server(interaction.guildId)
            let channel = await interaction.client.channels.fetch(server_info.channel_id)
            await manage_message(channel)
            await interaction.followUp({content:`Birthday removed.`,flags:MessageFlags.Ephemeral});
        }else{
            await interaction.followUp({content:`Your birthday isn't  on the list.`,flags:MessageFlags.Ephemeral});
        }
        
	},
};