const {SlashCommandBuilder, MessageFlags, PermissionFlagsBits} = require('discord.js');
const {save_server_role} = require("../../util/db.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-role')
		.setDescription('Define the role that will get pinged on the birthdays.')
        .addRoleOption(option =>
            option
            .setName("birthday-role")
            .setDescription("Role that will get pinged on the birthdays.")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
        const role = interaction.options.getRole("birthday-role");
        await interaction.deferReply()
        await save_server_role(interaction.channel.guildId,role.id);
        await interaction.followUp({content: "Birthday role updated",flag:MessageFlags.Ephemeral})       
	},
};
