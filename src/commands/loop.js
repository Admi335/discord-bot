const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Sets loop mode')
        .addIntegerOption(option =>
            option.setName('mode')
                .setDescription('Loop type')
                .setRequired(true)
                .addChoice('Off', QueueRepeatMode.OFF)
                .addChoice('Track', QueueRepeatMode.TRACK)
                .addChoice('Queue', QueueRepeatMode.QUEUE)
                .addChoice('Autoplay', QueueRepeatMode.AUTOPLAY))
}