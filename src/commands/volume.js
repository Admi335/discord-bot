const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Sets music volume')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The volume amount to set (0-100)')
                .setRequired(false))
}