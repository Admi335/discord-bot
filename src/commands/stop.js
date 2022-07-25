const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the player'),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return interaction.followUp({ content: "❌ | No music is being played!" });

        queue.destroy();
        return interaction.followUp({ content: "🛑 | Stopped the player!" });
    }
}
