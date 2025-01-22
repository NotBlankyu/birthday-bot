const {SlashCommandBuilder, MessageFlags, PermissionFlagsBits} = require('discord.js');
const {save_server_pings} = require("../../util/db.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-announcement-channel')
		.setDescription('Define the channel where the bot will send the birthday pings')
        .addChannelOption(option =>
            option
            .setName("birthday-channel")
            .setDescription("Channel where the birthday pings will be.")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
        const channel = interaction.options.getChannel("birthday-channel");
        await interaction.deferReply()
        await save_server_pings(channel.guildId,channel.id);
        await interaction.followUp({content: "Birthday channel updated",flag:MessageFlags.Ephemeral})
	},
};
