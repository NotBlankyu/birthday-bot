const {SlashCommandBuilder, MessageFlags, PermissionFlagsBits} = require('discord.js');
const {save_server} = require("../../util/db.js")
const {manage_message} = require("../../util/manage_list.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-channel')
		.setDescription('Define the channel where the bot will send the birthday list')
        .addChannelOption(option =>
            option
            .setName("birthday-channel")
            .setDescription("Channel where the birthday list will be.")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
        const channel = interaction.options.getChannel("birthday-channel");
        await interaction.deferReply()
        await save_server(channel.guildId,channel.id);
        await interaction.followUp({content: "Birthday channel updated",flag:MessageFlags.Ephemeral})
        await manage_message(channel)
        
		
        
	},
};
