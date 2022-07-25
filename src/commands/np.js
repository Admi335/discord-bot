const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Now playing'),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return interaction.followUp({ content: "❌ | No music is being played!" });

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [{
                title: "Now playing",
                description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
                fields: [{
                    name: "\u200b",
                    value: progress
                }],
                color: 0xffffff
            }]
        });
    }
}
