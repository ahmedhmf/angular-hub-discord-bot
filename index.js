const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const {token} = require('./config');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync('./src/functions')
functionFolders.map(folder => {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`);
    const files = functionFiles.filter(file => file.endsWith('.js'));
    files.map(functionFile => require(`./src/functions/${folder}/${functionFile}`)(client))
})
client.handleCommands();
client.handleEvents();

client.login(token);