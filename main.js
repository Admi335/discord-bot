/* This program is a Discord bot made using discord.js, a Discord API implementation for node.js
 * Copyright (C) 2021 Adam Říha
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * 
 * You can contact me, the creator of this program, via this email address: rihaadam1@seznam.cz
 */

const fs = require('fs');
const readline = require('readline');

const blacklist = require('./src/blacklistPhrases.js');
const settings = require('./src/settings.js');
const logs = require('./src/logs.js');

const banUser = require('./src/discord/banUser.js');
const deleteMsg = require('./src/discord/deleteMsg.js');
const sendMsg = require('./src/discord/sendMsg.js');

const findSubstring = require('./src/findSubstring.js');
const set = require('./src/settings/set.js');
const musicFuncs = require('./src/music.js');

const translations = require('./src/translations.json');

/*-----------------------------------------------------*/
/*-------------------- DISCORD BOT --------------------*/
/*-----------------------------------------------------*/

// Discord
const Discord = require('discord.js');
const { token } = require('./config.json');
const client = new Discord.Client();

const dataDir = './data/';

const blacklistPhrases = blacklist.get('./phrases_blacklist.txt');
const settingsMap = settings.get(dataDir);
const logMessagesMap = new Map();
setInterval(logs.write, 60 * 1000, logMessagesMap, dataDir); // Save logs every 60 seconds


client.once('ready', () => {
    console.log('\nConnected!');
});

client.once('reconnecting', () => {
    console.log('\nReconnecting...');
});

client.once('disconnect', () => {
    console.log('\nDisconnected!');
});


client.on('message', async message => {
    if (message.author.bot) return; // Check if author is bot

    if (!logMessagesMap.has(message.guild.id)) {
        logMessagesMap.set(message.guild.id, []);
    }

    if (!settingsMap.has(message.guild.id)) {
        settingsMap.set(message.guild.id, {
            prefix: "!",
            language: "en",
            logMessages: true,
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
    const serverQueue = musicFuncs.getQueue().get(message.guild.id);
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
                { name: 'prefix',   admin: false, description: `${descriptions.prefix + '\n' + descriptions.usage}: \`prefix\``},
                { name: 'help',     admin: false, description: `${descriptions.help + '\n' + descriptions.usage}: \`${prefix}help\`` },
                { name: 'set',      admin: true,  description: `${descriptions.set + '\n' + descriptions.usage}: \`${prefix}set exampleSetting "true"\`` },
                { name: 'settings', admin: true,  description: `${descriptions.settings + '\n' + descriptions.usage}: \`${prefix}settings\`` },
                { name: 'send',     admin: true,  description: `${descriptions.send + '\n' + descriptions.usage}: \`${prefix}send "example"\` or \`${prefix}send "example" #example-channel\`` },
                { name: 'ban',      admin: true,  description: `${descriptions.ban + '\n' + descriptions.usage}: \`${prefix}ban @example-user "Bad behavior" #bans\`` },
                { name: 'log',      admin: true,  description: `Posts the log file for this server\nUsage: \`${prefix}log\`` },
                { name: 'play',     admin: false, description: `${descriptions.play + '\n' + descriptions.usage}: \`${prefix}play "https://youtu.be/dQw4w9WgXcQ"\`` },
                { name: 'skip',     admin: false, description: `${descriptions.skip + '\n' + descriptions.usage}\: \`${prefix}skip\`` },
                { name: 'stop',     admin: false, description: `${descriptions.stop + '\n' + descriptions.usage}: \`${prefix}stop\`` },
                { name: 'current',  admin: false, description: `${descriptions.current + '\n' + descriptions.usage}\: \`${prefix}current\`` },
                { name: 'queue',    admin: false, description: `${descriptions.queue + '\n' + descriptions.usage}: \`${prefix}queue\`` },
                { name: 'lyrics',   admin: false, description: `${descriptions.lyrics + '\n' + descriptions.usage}: \`${prefix}lyrics\`` }
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

            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle(embedTitle)
                .setDescription(embedDescription)
                .addFields(commandsFields);
            
            return sendMsg(helpEmbed, channel);
        }

        else if (command.startsWith("settings") || command.startsWith("options")) {
            const settingsEmbed = new Discord.MessageEmbed()
                .setColor('#FF6666')
                .setTitle('Settings')
                .setDescription('List of all settings available')
                .addFields(
                    { name: 'prefix',              value: `Mostly a symbol that tells the bot to perform a command\nCurrent: ${serverSettings.prefix}\nDefault: "!"\nArguments: a character or a text` },
                    { name: 'language',            value: `Language in which you want the bot to communicate with you\nCurrent: ${serverSettings.language}\nDefault: en\nArguments: "en", "cs", or "it"` },
                    { name: 'logMessages',         value: `Wheter to log all messages posted to this server or not\nCurrent: ${serverSettings.logMessages}\nDefault: false\nArguments: "true" or "false"` },
                    { name: 'maxMessageLength',    value: `Maximum amount of characters a message can have (if you don\'t want a limit, set this to -1)\nCurrent: ${serverSettings.maxMessageLength}\nDefault: -1\nArguments: number <-1;∞>` },
                    { name: 'deleteBannedPhrases', value: `Whether to delete a message if it includes a blacklisted phrase\nCurrent: ${serverSettings.deleteBannedPhrases}\nDefault: true\nArguments: "true" or "false"` },
                    { name: 'banForBannedPhrases', value: `Whether to ban a user if his message includes a blacklisted phrase\nCurrent: ${serverSettings.banForBannedPhrases}\nDefault: false\nArguments: "true" or "false"` }
                );

            return sendMsg(settingsEmbed, channel);
        }

        else if (command.startsWith("ban")) {
            if (!targetUser)         return sendMsg("You need to specify whom to ban!", channel);
            else if (!targetString)  return banUser(targetUser);
            else if (!targetChannel) return banUser(targetUser, targetString, channel);
            else                     return banUser(targetUser, targetString, targetChannel);
        }

        else if (command.startsWith("send")) {
            if (!targetString || targetString.length == 0)
                return sendMsg(`[ERROR] You must write your message inside of two " or ', and your message cannot be empty. ${author}`, channel);

            if (targetChannel) sendMsg(targetString, targetChannel);
            else               sendMsg(targetString, channel);

           // return deleteMsg(message);
        }

        else if (command.startsWith("log")) {
            return message.channel.send("Log file for this server:", { files: [`./data/logs/${message.guild.id}.log`] });
        }

    /* PLAYING MUSIC */
        else if (command.startsWith("play")) {
            if (!voiceChannel)
                return sendMsg("You need to be in a voice channel to play music!", channel);
        
            return musicFuncs.queueSong(message, targetString, serverQueue);
        }

        else if (command.startsWith("skip")) {
            if (!voiceChannel)
                return sendMsg("You have to be in a voice channel to skip the music!", channel);

            if (!serverQueue)
                return sendMsg("There is no song that I could skip!", channel);

            return musicFuncs.skipSong(serverQueue, channel);
        }

        else if (command.startsWith("stop")) {
            if (!voiceChannel)
                return sendMsg("You have to be in a voice channel to stop the music!", channel);

            if (!serverQueue)
                return sendMsg("There is no song that I could stop!", channel);

            return musicFuncs.stopPlaying(serverQueue, channel);
        }

        else if (command.startsWith("current")) {
            if (!serverQueue)
                return sendMsg("There is no song to skip!", channel);
                
            return musicFuncs.getCurrentSong(serverQueue, channel);
        }

        else if (command.startsWith("queue")) {
            if (!serverQueue) 
                return sendMsg("There are no songs in the queue!", channel);
            
            return musicFuncs.getQueuedSongs(serverQueue, channel);
        }

        else if (command.startsWith("lyrics")) {
            return musicFuncs.getLyrics(serverQueue, channel);            
        }

    /* SETTINGS */
        else if (command.startsWith("set")) {
            const setting = command.split(" ")[1];
            set(setting, targetString, serverSettings, channel);
            
            return settings.set(message.guild.id, serverSettings);
        }
    }
});

client.login(token);

isExited = false;

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
