const fs = require('fs');
const path = require('path');

function add(message, logMessagesMap) {
    let tempLog = logMessagesMap.get(message.guild.id);

    const d = new Date();

    tempLog.push([
        `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`,
        message.member.user.username,
        message.channel.name,
        message.content
    ]);
    
    logMessagesMap.set(message.guild.id, tempLog);
}

function write(logMessagesMap, directory) {
    console.log("\nWriting log files");

    const d = new Date();

    logMessagesMap.forEach((value, key) => {
        if (value.length > 0) {
            let content = "";

            for (let i = 0; i < value.length; i++) {
                content += `Time: ${value[i][0]}\nUser: ${value[i][1]}\nChannel: ${value[i][2]}\nContent:\n${value[i][3]}\n--------------------------------------\n\n\n`;
            }

            fs.writeFileSync(path.join(directory, key, `${d.getUTCMonth() + 1}-${d.getUTCDate()}-${d.getUTCFullYear()}.log`), content, { flag: 'a+' }, err => {
                if (err)
                    return console.error(`\nFailed to save logs for server ID ${key}!\nError: ` + err);
            });
        }
    });

    console.log("Completed writing log files");

    logMessagesMap.clear();
}

module.exports = {
    add,
    write
};