/* This program is a Discord bot made using discord.js, a Discord API implementation for node.js
 * Copyright (C) 2021 Adam Říha
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * You can contact me, the creator of this program, via this email address: rihaadam1@seznam.cz
 */

const fs = require('fs');
const path = require('path');

const blacklist = require('./src/blacklistPhrases.js');
const settings = require('./src/settings.js');
const logs = require('./src/logs.js');

const { sendMsg, deleteMsg, banUser } = require('./src/discordFuncs.js');

const findSubstring = require('./src/findSubstring.js');


const translations = new Map();

fs.access('./src/translations/', fs.F_OK, err => {
    if (err) return console.log(`\nCouldn't read from directory containing translation files!\n`);
    
    const files = fs.readdirSync('./src/translations/').map(fileName => {
        return path.join('./src/translations/' + fileName);
    }).filter(file => path.extname(file).toLowerCase() === '.json');
    
    files.forEach(file => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) return console.error(`Failed to read a translation file ${file}\nError: ` + err);
            
            data = JSON.parse(data);
            translations.set(path.parse(file).name, data);
        });
    });
});

/*-----------------------------------------------------*/
/*-------------------- DISCORD BOT --------------------*/
/*-----------------------------------------------------*/

// Discord
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token, applicationId } = require('./config.json');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const dataDir = './data/';

const blacklistPhrases = blacklist.get('./phrases_blacklist.txt');
const settingsMap = settings.get(dataDir);
const logMessagesMap = new Map();
setInterval(logs.write, 60 * 1000, logMessagesMap, dataDir); // Save logs every 60 seconds


// Addons
if (fs.existsSync('./addons/')) {
    const addonFiles = fs.readdirSync('./addons/').filter(file => file.endsWith('.js'));

    for (const file of addonFiles) {
        const addon = require(`./addons/${file}`);
        addon(client);
    }
}


// Slash commands
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(applicationId),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (err) {
        console.error(err);
    }
})();


// Discord player
const { Player } = require('discord-player');
const player = new Player(client);

player.on("trackStart", (queue, track) => {
    try {
        queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`);
    } catch (err) {
        console.log("trackStart err: ", err);
    }
});
player.on("error", err => {
    console.log("Discord player error: ", err);
});
player.on("connectionError", err => {
    console.log("Discord player connection error: ", err);
});


client.once('ready', () => {
    console.log('\nConnected!');
});
client.once('reconnecting', () => {
    console.log('\nReconnecting...');
});
client.once('disconnect', () => {
    console.log('\nDisconnected!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.execute(interaction, player);
    } catch (err) {
        if (err) console.log("Slash command execution error: ", err);
        await interaction.reply({ content: "Couldn't execute this command!", ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; // Check if author is bot

    if (!logMessagesMap.has(message.guild.id)) {
        logMessagesMap.set(message.guild.id, []);
    }

    if (!settingsMap.has(message.guild.id)) {
        settingsMap.set(message.guild.id, {
            prefix: "!",
            language: "en",
            logMessages: false,
            maxMessageLength: -1,
            deleteBannedPhrases: true,
            banForBannedPhrases: false
        });

        fs.mkdirSync(`${dataDir}${message.guild.id}/`, { recursive: true });
    }

    const channel = message.channel;
    const content = message.content.trim();
    const author = message.member;

    const voiceChannel = message.member.voice.channel;
    //const VCpermissions = voiceChannel.permissionsFor(message.client.user);

    const serverSettings = settingsMap.get(message.guild.id);
    // const serverQueue = musicFuncs.getQueue().get(message.guild.id);
    const serverLang = translations[serverSettings.language];
    const prefix = serverSettings.prefix;

    // Message length
    if (content.length >= serverSettings.maxMessageLength && serverSettings.maxMessageLength != -1)
        return deleteMsg(message, `Your message is too long! ${author}`, channel);

    // Log message
    if (serverSettings.logMessages)
        logs.add(message, logMessagesMap);

    // Blacklist
    if (blacklist.checkOccurences(content, blacklistPhrases)) {
        console.log("true");
        if (serverSettings.deleteBannedPhrases)
            deleteMsg(message, `You wrote some bad words! ${author}`, channel);

        if (serverSettings.banForBannedPhrases)
            banUser(author, `You wrote some bad words! ${author}`, author);
    }

    // Send prefix
    if (content.toLowerCase() == "prefix")
        return sendMsg(`My prefix is ${prefix}`, channel);

    /* COMMANDS */
    else if (content.startsWith(prefix)) {
        let command = content.slice(prefix.length);
        let targetUser = message.mentions.members.first();
        let targetString = findSubstring(command);
        let targetChannel = message.mentions.channels.first();

        for (let i = 0; i < command.length; i++) {
            if (command[i] == " " || !command[i]) break;
            command[i].toLowerCase();
        }

        if (command.startsWith("help") || command.startsWith("adminHelp")) {
            const helpTranslation = serverLang.embeds.help;
            const descriptions = helpTranslation.fields;

            const commands = [
                { name: 'prefix', admin: false, description: `${descriptions.prefix + '\n' + descriptions.usage}: \`prefix\`` },
                { name: 'help', admin: false, description: `${descriptions.help + '\n' + descriptions.usage}: \`${prefix}help\`` },
                { name: 'set', admin: true, description: `${descriptions.set + '\n' + descriptions.usage}: \`${prefix}set exampleSetting "true"\`` },
                { name: 'settings', admin: true, description: `${descriptions.settings + '\n' + descriptions.usage}: \`${prefix}settings\`` },
                { name: 'send', admin: true, description: `${descriptions.send + '\n' + descriptions.usage}: \`${prefix}send "example"\` or \`${prefix}send "example" #example-channel\`` },
                { name: 'ban', admin: true, description: `${descriptions.ban + '\n' + descriptions.usage}: \`${prefix}ban @example-user "Bad behavior" #bans\`` },
                { name: 'log', admin: true, description: `Posts the log file for this server\nUsage: \`${prefix}log\`` },
                { name: 'play', admin: false, description: `${descriptions.play + '\n' + descriptions.usage}: \`${prefix}play "https://youtu.be/dQw4w9WgXcQ"\`` },
                { name: 'skip', admin: false, description: `${descriptions.skip + '\n' + descriptions.usage}\: \`${prefix}skip\`` },
                { name: 'stop', admin: false, description: `${descriptions.stop + '\n' + descriptions.usage}: \`${prefix}stop\`` },
                { name: 'current', admin: false, description: `${descriptions.current + '\n' + descriptions.usage}\: \`${prefix}current\`` },
                { name: 'queue', admin: false, description: `${descriptions.queue + '\n' + descriptions.usage}: \`${prefix}queue\`` },
                { name: 'lyrics', admin: false, description: `${descriptions.lyrics + '\n' + descriptions.usage}: \`${prefix}lyrics\`` }
            ]

            let commandsFields = [];
            let embedTitle, embedDescription;

            if (command.startsWith("help")) {
                for (let i = 0; i < commands.length; i++) {
                    if (!commands[i].admin)
                        commandsFields.push({ name: commands[i].name, value: commands[i].description });
                }

                embedTitle = helpTranslation.title;
                embedDescription = helpTranslation.description;
            }
            else {
                for (let i = 0; i < commands.length; i++) {
                    if (commands[i].admin)
                        commandsFields.push({ name: commands[i].name, value: commands[i].description });
                }

                embedTitle = helpTranslation.adminTitle;
                embedDescription = helpTranslation.adminDescription;
            }

            const helpEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(embedTitle)
                .setDescription(embedDescription)
                .addFields(commandsFields);

            try {
                message.channel.send({ embeds: [helpEmbed] });
            } catch (err) {
                console.log("Embed err: ", err);
            }
        }

        else if (command.startsWith("settings") || command.startsWith("options")) {
            const settingsEmbed = new MessageEmbed()
                .setColor('#FF6666')
                .setTitle('Settings')
                .setDescription('List of all settings available')
                .addFields(
                    { name: 'prefix', value: `Mostly a symbol that tells the bot to perform a command\nCurrent: ${serverSettings.prefix}\nDefault: "!"\nArguments: a character or a text` },
                    { name: 'language', value: `Language in which you want the bot to communicate with you\nCurrent: ${serverSettings.language}\nDefault: en\nArguments: "en", "cs", or "it"` },
                    { name: 'logMessages', value: `Wheter to log all messages posted to this server or not\nCurrent: ${serverSettings.logMessages}\nDefault: false\nArguments: "true" or "false"` },
                    { name: 'maxMessageLength', value: `Maximum amount of characters a message can have (if you don\'t want a limit, set this to -1)\nCurrent: ${serverSettings.maxMessageLength}\nDefault: -1\nArguments: number <-1;∞>` },
                    { name: 'deleteBannedPhrases', value: `Whether to delete a message if it includes a blacklisted phrase\nCurrent: ${serverSettings.deleteBannedPhrases}\nDefault: true\nArguments: "true" or "false"` },
                    { name: 'banForBannedPhrases', value: `Whether to ban a user if his message includes a blacklisted phrase\nCurrent: ${serverSettings.banForBannedPhrases}\nDefault: false\nArguments: "true" or "false"` }
                );

            return sendMsg(settingsEmbed, channel);
        }

        else if (command.startsWith("ban")) {
            if (!targetUser) return sendMsg("You need to specify whom to ban!", channel);
            else if (!targetString) return banUser(targetUser);
            else if (!targetChannel) return banUser(targetUser, targetString, channel);
            else return banUser(targetUser, targetString, targetChannel);
        }

        else if (command.startsWith("send")) {
            if (!targetString || targetString.length == 0)
                return sendMsg(`[ERROR] You must write your message inside of two " or ', and your message cannot be empty. ${author}`, channel);

            if (targetChannel) await sendMsg(targetString, targetChannel);
            else await sendMsg(targetString, channel);

            return deleteMsg(message);
        }

        else if (command.startsWith("log")) {
            logPath = await logs.get(message.guild.id, targetString, dataDir);

            if (logPath == "") return sendMsg("Log file for this date does not exist!", channel);
            else return message.channel.send("Log file for this server:", { files: [logPath] });
        }

        /* SETTINGS */
        else if (command.startsWith("set")) {
            const setting = command.split(" ")[1];
            settings.set(setting, targetString, serverSettings, channel);

            return settingsMap.set(message.guild.id, serverSettings);
        }
    }
});

client.login(token);

let isExited = false;

// Save settings and logs on exit
["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"].forEach(eventType => {
    process.on(eventType, () => {
        if (!isExited) {
            settings.write(settingsMap, dataDir);
            logs.write(logMessagesMap, dataDir);

            isExited = true;
            process.exit();
        }
    });
});
