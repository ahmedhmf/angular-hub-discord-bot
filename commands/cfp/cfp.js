const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const pagination = require('../../src/utils/send-paginated-message');
const createEmbed = require('../../src/utils/create-embed');
const axios = require('axios');
const getLogo = require("../../src/utils/get-logo");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cfp')
        .setDescription('Command to get all CFPs for Communities and Events')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Filter Communities by Country or City')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Filter CFPs by type (Conference or Meetups)')
                .setRequired(false)
                .addChoices(
                    {name: 'Conference', value: 'conference'},
                    {name: 'Meetups', value: 'meetup'},
                )
        )
        .addBooleanOption(option =>
            option.setName('online')
                .setDescription('Show Online Communities')
                .setRequired(false)
        ),
    async execute(interaction, client) {

        try {
            let communityCFPs = await axios.get('https://angular-hub.com/api/v1/communities/callforpapers');
            let eventsCFPs = await axios.get('https://angular-hub.com/api/v1/events/callforpapers');

            let cfps =[...communityCFPs.data, ...eventsCFPs.data];
            const locationFilter = interaction.options._hoistedOptions.filter(x => x.name === 'location');
            const onlineFilter = interaction.options._hoistedOptions.filter(x => x.name === 'online');
            const typeFilter = interaction.options._hoistedOptions.filter(x => x.name === 'type');
            const locationOption = locationFilter.length === 0 ? undefined : locationFilter[0].value;
            const onlineOption = onlineFilter.length === 0 ? undefined : onlineFilter[0].value;
            const typeOption = typeFilter.length === 0 ? undefined : typeFilter[0].value;
            if (locationOption) {
                cfps = cfps.filter(x =>
                    x.location?.toLowerCase().includes(locationOption.toLowerCase()));
            }
            if (typeOption) {
                cfps = cfps.filter(x =>
                    x.type?.toLowerCase() === typeOption);
            }
            if (onlineOption) {
                cfps = cfps.filter(x =>
                    x.location?.toLowerCase().includes('online'));
            }
            if (cfps.length > 0) {
                const embeds = [];
                cfps.map(async x => {
                    embeds.push(createEmbed(
                        x.name,
                        x.callForPapers ?? x.callForPapersUrl,
                        {name: 'Type: ' + x.type.charAt(0).toUpperCase() + x.type.slice(1)},
                        getLogo(x.logo),
                        createDescription(x)
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

function createDescription(data){
    let description = '';
    if(data.location) description += `Location: ${data.location}\n`;
    if(data.date) description += `Event Date: ${data.date}\n`;
    if(data.callForPapersDueDate) description += `Call For Papers Due Date: ${data.callForPapersDueDate}\n`;
    if(data.twitter) description += `Twitter: ${data.twitter}\n`;
    if(data.linkedin) description += `Linkedin: ${data.linkedin}\n`;
    return description;
}