const {EmbedBuilder} = require("discord.js");
module.exports = (title, url, author, thumbnail, description) => {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF);
    if (title) embed.setTitle(title);
    if (url) embed.setURL(url);
    if (author) embed.setAuthor(author);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (description) embed.setDescription(description);
    return embed;
}