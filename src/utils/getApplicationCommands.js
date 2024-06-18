module.exports = async (client, guildId) => {
    let applicationCommands;

    if (guildId) {
        const guild = await client.guildIds.fetch(guildId);
        applicationCommands = guild.commands;
    } else {
        applicationCommands = client.application.commands;
    }

    await applicationCommands.fetch();
    return applicationCommands;
}