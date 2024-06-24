const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const pagination = require('../../src/utils/send-paginated-message');
const createEmbed = require('../../src/utils/create-embed');
const getLogo = require('../../src/utils/get-logo');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('podcasts')
        .setDescription('command to get all registered Podcasts')
        .addStringOption(option =>
            option.setName('languages')
                .setDescription('Filter Podcasts by Language')
                .setRequired(false)
                .addChoices(
                    {name: 'Spanish', value: 'spanish'},
                    {name: 'English', value: 'english'},
                    {name: 'All', value: 'all'},
                    {name: 'Italian', value: 'all'}
                )),
    async execute(interaction, client) {
        try {


            let result = await axios.get('https://angular-hub.com/api/v1/podcasts');
            let podcasts = [];
            const languageProperty = interaction.options._hoistedOptions.filter(x => x.name === 'languages');
            const languageOption = languageProperty.length === 0 ? undefined : languageProperty[0].value;
            if (!languageOption || languageOption === "all") {
                podcasts = result.data;
            } else {
                podcasts = result.data.filter(podcast => podcast.language.toLowerCase() === languageOption);
            }
            if (podcasts.length > 0) {
                const embeds = [];
                podcasts.map(async x => {
                    embeds.push(createEmbed(
                        x.name,
                        x.url,
                        {name: 'Language:' + x.language},
                        getLogo(x.logo),
                        undefined
                    ))
                })
                await pagination(interaction, embeds);
            } else {
                interaction.reply({content: 'No Results Found!', ephemeral: true});
            }
        } catch (e) {
            console.error(e);
        }
    }

}