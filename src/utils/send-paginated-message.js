const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Example function to create the paginated message
module.exports = async (interaction, embeds)=>{
    let currentPage = 0;
    const totalPages = embeds.length;

    const createEmbedMessage = (page) => {
        return embeds[page].setFooter({ text: `Page ${page + 1} of ${totalPages}` });
    };

    const createButtons = () => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPages - 1)
        );
    };

    const message = await interaction.reply({
        embeds: [createEmbedMessage(currentPage)],
        components: [createButtons()],
        ephemeral: true // Makes the message ephemeral
    });

    const collector = message.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async (buttonInteraction) => {
        if (buttonInteraction.customId === 'next' && currentPage < totalPages - 1) {
            currentPage++;
        } else if (buttonInteraction.customId === 'previous' && currentPage > 0) {
            currentPage--;
        }

        await buttonInteraction.update({
            embeds: [createEmbedMessage(currentPage)],
            components: [createButtons()]
        });
    });

    collector.on('end', async () => {
        await interaction.editReply({ components: [] });
    });
}