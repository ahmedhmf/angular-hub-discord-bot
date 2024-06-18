const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test")
        .setDMPermission(false)
        .addSubcommandGroup(subcommandGroup => {
            subcommandGroup
                .setName("user")
                .setDescription("user")
                .addSubcommand(subcommand =>
                    subcommand.setName("role")
                        .setDescription("role")
                        .addUserOption(option => {
                            option.setName("user").setDescription("user config")
                        })
                )
                .addSubcommand(subcommand =>
                    subcommand.setName("nickname")
                        .setDescription("nickname")
                        .addUserOption(option => {
                            option.setName("nickname").setDescription("user nickname")
                        })
                        .addUserOption(option => {
                            option.setName("user").setDescription("user config")
                        })
                )
                .addSubcommand(subcommand =>
                    subcommand.setName("message")
                        .setDescription("message")
                )
        }).toJSON(),
    userPermissions: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.Connect],
    run: (client, interaction)=>{
        return interaction.reply('Replay Test Command')
    }

}