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
                .addChoice('Autoplay', QueueRepeatMode.AUTOPLAY)),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return interaction.followUp({ content: "❌ | No music is being played!" });

        const loopMode = interaction.options.get("mode").value;

        const success = queue.setRepeatMode(loopMode);
        const mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
        return interaction.followUp({ content: success ? `${mode} | Updated loop mode!` : "❌ | Could not update loop mode!" });
    }
}
