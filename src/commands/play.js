const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube, Spotify or SoundCloud')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song you want to play')
                .setRequired(true)),
    async execute(interaction, player) {
        if (!interaction.member.voice.channelId)
            return await interaction.reply({ content: "You need to be in a voice channel to play music!", ephemeral: true });

        const query = interaction.options.get("query").value;
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Couldn't join the voice channel!", ephemeral: true });
        }

        await interaction.deferReply();
        const searchResults = await player.search(
            query, { requestedBy: interaction.user }
        );

        if (!searchResults || !searchResults.tracks.length)
            return await interaction.followUp({ content: `❌ | Track/Playlist: **${query}** not found!` });

        searchResults.playlist ? queue.addTracks(searchResults.tracks) : queue.addTrack(searchResults.tracks[0]);
        console.log(searchResults.playlist);

        if (!queue.playing) await queue.play();
        return interaction.followUp({ content: `Queued **${query}**!` });
    }
}
