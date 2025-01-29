const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const {save_birthday,get_server} = require("../../util/db.js");
const {manage_message} = require("../../util/manage_list.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addbirthday')
		.setDescription('Add your birthday to the list')
        .addIntegerOption(option =>
            option
            .setName('day')
            .setDescription('Day of your birthday')
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option
            .setName('month')
            .setDescription('Month of your birthday')
            .setMinValue(1)
            .setMaxValue(12)
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option
            .setName('year')
            .setDescription('Year of your birthday')
            .setMinValue(1900)
            .setRequired(true)
        ),
	async execute(interaction) {
        await interaction.deferReply()
        const day = interaction.options.getInteger('day')
        const month = interaction.options.getInteger('month');
        const year = interaction.options.getInteger('year');
        await save_birthday(interaction.guildId,interaction.user.id,interaction.user.displayName,`${day}/${month}/${year}`)
        let server_info = await get_server(interaction.guildId)
        if(server_info == null  || server_info.channel_id == null){
            await interaction.followUp({content:`The birthday channel needs to be defined first.`,flags:MessageFlags.Ephemera})
            return;
        }
        let channel = await interaction.client.channels.fetch(server_info.channel_id)
        await manage_message(channel)
		await interaction.followUp({content:`Your birthday was set to ${day}/${month}/${year} .`,flags:MessageFlags.Ephemeral});
	},
};