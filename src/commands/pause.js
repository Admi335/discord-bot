const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return interaction.followUp({ content: "❌ | No music is being played!" });

        const paused = queue.setPaused(true);
        return interaction.followUp({ content: paused ? "⏸ | Paused!" : "❌ | Something went wrong!" });
    }
}
