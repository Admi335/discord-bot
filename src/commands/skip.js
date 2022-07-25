const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return await interaction.followUp({ content: "❌ | No music is being played!" });

        const skipped = queue.skip();
        return interaction.followUp({ content: skipped ? `✅ | Skipped **${queue.current}**!` : "❌ | Something went wrong!" });
    }
}
