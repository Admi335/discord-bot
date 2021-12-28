const fs = require('fs');
const readline = require('readline');

function get(filePath) {
    let blacklist = [];

    fs.access(filePath, fs.F_OK, err => {
        if (err) {
            return console.log("\nBlacklist of phrases doesn't exist, or I do not have access to it\n");
        }
    
        let rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });
    
        console.log("\nBlacklisted phrases:");
    
        rl.input.on('error', err => {
            console.log("Failed to read file!\n" + err);
        });
    
        rl.on('line', line => {
            line.trim();
    
            if (!line.startsWith("!--")) {
                console.log(line);
                blacklist.push(line.toLowerCase());
            }
        });
    });

    return blacklist;
}

function checkOccurences(text, blacklistArr) {
    blacklistArr.forEach(phrase => {
        console.log(phrase);
        if (text.toLowerCase().includes(phrase)) {
            console.log("includes");
            /*if ((text[text.indexOf(phrase) - 1] == ' ' ||
                !text[text.indexOf(phrase) - 1])
                &&
                (text[text.indexOf(phrase) + phrase.length] == ' ' ||
                !text[text.indexOf(phrase) + phrase.length])) {
                    return true;
            }*/
            if (!(text[text.indexOf(phrase) - 1])) {
                    return true;
                }
        }
    });

    return false;
}

module.exports = {
    get,
    checkOccurences
};