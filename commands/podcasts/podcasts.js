const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const pagination = require('../../src/utils/pagination');
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('podcasts')
        .setDescription('command to get all registered Podcasts')
        .addStringOption(option =>
            option.setName('languages')
                .setDescription('podcast Language')
                .setRequired(true)
                .addChoices(
                    { name: 'Spanish', value: 'spanish' },
                    { name: 'English', value: 'english' },
                    { name: 'All', value: 'all' }
                )),
    async execute(interaction, client) {
        let result = await axios.get('https://angular-hub.com/api/v1/podcasts');
        let podcasts = [];
        const languageProperty = interaction.options._hoistedOptions.filter(x=>x.name ==='languages');
        if (languageOption === "all") {
            podcasts = result.data;
        } else {
            podcasts = result.data.filter(podcast => podcast.language.toLowerCase() === languageOption);
        }

        const embeds = [];
        podcasts.map(async x => {
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
        .setThumbnail("https://angular-hub.com/" + content.logo)
}