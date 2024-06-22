const {ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType} = require('discord.js');
module.exports = async (interaction, pages, time = 30 * 1000) => {
    try {
        if (!interaction || !pages || !pages > 0) throw new Error('invalid arguments!');
        await interaction.deferReply();
        if (pages.length === 1) {
            await interaction.editReply({
                embeds: pages,
                components: [],
                fetchReply: true,
                ephemeral: true
            });
            return;
        }

        const prev = new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('Prev')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        const home = new ButtonBuilder()
            .setCustomId('home')
            .setLabel('Home')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        const next = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Danger);

        const buttons = new ActionRowBuilder().addComponents([prev, home, next]);

        let index = 0;
        const msg = await interaction.editReply({
            embeds: [pages[index]],
            components: [buttons],
            fetchReplay: true,
            ephemeral: true
        })

        const mc = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });
        mc.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return await i.reply({content: 'you are not allowed to do this!', ephemeral: true});
            }
            await i.deferUpdate();
            if (i.customId === "prev") {
                if (index > 0) {
                    index -= 1;
                }
            } else if (i.customId === "next") {
                if (index < pages.length) {
                    index += 1;
                }

            } else if (i.customId === "home") {
                index = 0;
            }

            if (index === 0) {
                prev.setDisabled(true);
                home.setDisabled(true);
            } else {
                prev.setDisabled(false);
                home.setDisabled(false);
            }
            if (index === pages.length - 1) {
                next.setDisabled(true);
            } else {
                next.setDisabled(false);
            }

            await msg.edit({
                embeds: [pages[index]],
                components: [buttons]
            })
            mc.resetTimer();
        })
        mc.on('end', async () => {
            await msg.edit({
                embeds: [pages[index]],
                components: []
            })
            return msg;
        })
    } catch (e) {
        console.log(e);
    }
}