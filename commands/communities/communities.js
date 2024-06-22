const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const pagination = require('../../src/utils/pagination');
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('communities')
        .setDescription('Command to get all registered Communities')
        .addStringOption(option =>
            option.setName('languages')
                .setDescription('Community Language')
                .setRequired(true)
                .addChoices(
                    { name: 'Spanish', value: 'spanish' },
                    { name: 'English', value: 'english' },
                    { name: 'All', value: 'all' }
                )),
    async execute(interaction, client) {
        let result = await axios.get('https://angular-hub.com/api/v1/communities');
        let communities = [];
        // const languageProperty = interaction.options._hoistedOptions.filter(x=>x.name ==='languages');
        // if (languageOption === "all") {
            communities = result.data;
        // } else {
        //     communities = result.data.filter(podcast => podcast.language.toLowerCase() === languageOption);
        // }

        const embeds = [];
        communities.map(async x => {
            embeds.push(createEmbed(x))
        })
        const myEmbed = [];
        for (var i = 0; i < 10; i++) {
            myEmbed.push(new EmbedBuilder().setDescription('Hi'))
        }
        await pagination(interaction, embeds);
    }

}

function createEmbed(content) {
    console.log(content);
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(content.name)
        .setURL(content.url)
        .setAuthor({name: 'Language:' + content.language})
        .setDescription(`Location: ${content.location}\nTwitter: ${content.twitter}`)
        .setThumbnail("https://angular-hub.com/" + content.logo)
}