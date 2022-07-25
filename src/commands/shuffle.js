const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle songs in the current queue'),
    async execute(interaction, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

        const success = queue.shuffle();
        return interaction.followUp({ content: success ? 'Queue shuffled!' : 'Could not shuffle the queue!' });
    }
}
