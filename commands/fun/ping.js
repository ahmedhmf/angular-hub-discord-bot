const {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('This will ping the server'),
    async execute(interaction, client){
        const message = await interaction.deferReply({fetchReply: true})
        const pingMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply(pingMessage);
    }

}