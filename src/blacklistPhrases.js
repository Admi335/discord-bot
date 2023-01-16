const fs = require('fs');

function get(filePath) {
    let blacklist = [];

    try {
        await fs.promises.access(filePath);
        
        let data = await fs.promises.readFile(filePath);
        let lines = data.toString().split("\n");
        
        console.log("\nBlacklisted phrases:");
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].trim();
            
            if (!lines[i].startsWith("!--")) {
                console.log(lines[i]);
                blacklist.push(lines[i]);
            }
        }
    } catch (err) {
        console.log("\nBlacklist of phrases doesn't exist, or I do not have access to it\n");
    }

    return blacklist;
}

function checkOccurences(text, blacklistArr) {
    let regex = new RegExp(`\\b(${blacklistArr.join('|')})\\b`, 'i');
    return regex.test(text);
}

module.exports = {
    get,
    checkOccurences
};
