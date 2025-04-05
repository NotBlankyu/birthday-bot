const {SlashCommandBuilder, MessageFlags, PermissionFlagsBits} = require('discord.js');
const {save_server_voice} = require("../../util/db.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-voice-channel')
        .setDescription('Define the channel where people need to join to create a channel')
        .addChannelOption(option =>
            option
            .setName("voice-channel")
            .setDescription("Channel where people need to join.")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.options.getChannel("voice-channel");
        await interaction.deferReply()
        await save_server_voice(channel.guildId,channel.id);
        await interaction.followUp({content: "Voice channel updated",flag:MessageFlags.Ephemeral})
    },
};
