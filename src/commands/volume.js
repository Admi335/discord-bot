const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Sets music volume')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The volume amount to set (0-100)')
                .setRequired(false)),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return interaction.followUp({ content: "❌ | No music is being played!" });

        const vol = interaction.options.get("amount");

        if (!vol)
            return interaction.followUp({ content: `🎧 | Current volume is **${queue.volume}**%!` });
        if ((vol.value) < 0 || (vol.value) > 100)
            return interaction.followUp({ content: "❌ | Volume range must be 0-100" });

        const success = queue.setVolume(vol.value);
        return interaction.followUp({ content: success ? `✅ | Volume set to **${vol.value}%**!` : "❌ | Something went wrong!" });
    }
}
