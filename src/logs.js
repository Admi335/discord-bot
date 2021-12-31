const fs = require('fs');
const path = require('path');

function add(message, logMessagesMap) {
    let tempLog = logMessagesMap.get(message.guild.id);

    const d = new Date();
    const time = (d.getUTCHours()   < 10 ? '0' : '') + d.getUTCHours()   + ':' +
                 (d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes() + ':' +
                 (d.getUTCSeconds() < 10 ? '0' : '') + d.getUTCSeconds();

    tempLog.push([
        time,
        message.member.user.username,
        message.channel.name,
        message.content
    ]);
    
    logMessagesMap.set(message.guild.id, tempLog);
}

function get(serverID, date, directory) {
    if (!date) return sendMsg("You need to specify a date", channel);
    date.trim();

    if ((date.match(/-/g) || []).length == 1) {
        const d = new Date();
        date += '-' + d.getUTCFullYear();
    }

    filePath = path.join(directory, serverID, date + '.log');
    
    return fs.promises.access(filePath, fs.F_OK)
            .then(() => filePath)
            .catch(() => "");
}

function write(logMessagesMap, directory) {
    console.log("\nWriting log files");

    const d = new Date();

    logMessagesMap.forEach((value, key) => {
        if (value.length > 0) {
            let content = "";

            for (let i = 0; i < value.length; i++) {
                content += `Time: ${value[i][0]} UTC\nUser: ${value[i][1]}\nChannel: ${value[i][2]}\nContent:\n${value[i][3]}\n--------------------------------------\n\n\n`;
            }

            fs.writeFileSync(path.join(directory, key, `${d.getUTCMonth() + 1}-${d.getUTCDate()}-${d.getUTCFullYear()}.log`), content, { flag: 'a+' }, err => {
                if (err)
                    return console.error(`\nFailed to save logs for server ID ${key}!\nError: ` + err);
            });
        }
    });

    console.log("Completed writing log files");RealAtomek/raven-bot

    logMessagesMap.clear();
}

module.exports = {
    add,
    get,
    write
};
