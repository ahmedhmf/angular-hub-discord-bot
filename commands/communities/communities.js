const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const pagination = require('../../src/utils/send-paginated-message');
const createEmbed = require('../../src/utils/create-embed');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('communities')
        .setDescription('Command to get all registered Communities')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Filter Communities by Country or City')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('online')
                .setDescription('Show Online Communities')
                .setRequired(false)
        ),
    async execute(interaction, client) {

        try {
            let result = await axios.get('https://angular-hub.com/api/v1/communities');
            let communities = result.data;
            const locationFilter = interaction.options._hoistedOptions.filter(x => x.name === 'location');
            const onlineFilter = interaction.options._hoistedOptions.filter(x => x.name === 'online');
            const locationOption = locationFilter.length === 0 ? undefined : locationFilter[0].value;
            const onlineOption = onlineFilter.length === 0 ? undefined : onlineFilter[0].value;

            if (locationOption) {
                communities = communities.filter(x =>
                    x.location?.toLowerCase().includes(locationOption.toLowerCase()));
            }
            if (onlineOption) {
                communities = communities.filter(x =>
                    x.location?.toLowerCase().includes('online'));
            }
            if (communities.length > 0) {
                const embeds = [];
                communities.map(async x => {
                    embeds.push(createEmbed(
                        x.name,
                        x.url,
                        {name: 'Type: ' + x.type},
                        "https://angular-hub.com/" + x.logo,
                        `Location: ${x.location}\nTwitter: ${x.twitter ?? 'No Twitter Account'}`
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