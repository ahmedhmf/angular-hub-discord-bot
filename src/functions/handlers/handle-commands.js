const { REST, Routes } = require('discord.js')
const fs = require('fs')
const { token, testServer, clientID } = require('../../../config')

module.exports = (client) => {
    client.handleCommands = async () => {
        // Registring Commands
        const commandFolders = fs.readdirSync('./commands')
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js')) // Read Folders In Commands Folder

            const { commands, commandArray } = client
            for (const file of commandFiles) {
                const command = require(`../../../commands/${folder}/${file}`) // Read Files Of Command Folder
                commands.set(command.data.name, command) // Register Command
                commandArray.push(command.data.toJSON())
            }
        }

        const rest = new REST({ version: '10' }).setToken(token)

        try {
            console.log(`Started Refreshing Commands`)

            await rest.put(
                // Routes.applicationCommands(clientID, guildID), // This Will Work For Specific Guild(Server)
                Routes.applicationCommands(clientID), // This Will Work For Multi Guild(Server)
                { body: client.commandArray }
            )

            console.log(`Successfully Refreshed Commands`)
        } catch (error) {
            console.error(error)
        }
    }
}