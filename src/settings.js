const fs = require('fs');
const path = require('path');

const { sendMsg } = require('./discordFuncs.js');


const isBool = (str) => {
    return str == "true" || str == "false";
};
const isNumber = (str) => {
    return !((isNaN(str) && isNaN(parseFloat(str))) || parseInt(str) < -1)
};
const isDirectory = fileName => {
    return fs.lstatSync(fileName).isDirectory();
};


function get(directory) {
    const settingsMap = new Map();
    
    fs.access(directory, fs.F_OK, err => {
        if (err) return console.log(`\nDirectory ${directory} does not exist, or I do not have access to it\n`);
    
        const directories = fs.readdirSync(directory).map(fileName => {
            return path.join(directory + fileName);
        }).filter(isDirectory);

        directories.forEach(subdirectory => {
            fs.readFile(`${subdirectory}/settings.json`, 'utf-8', (err, data) => {
                if (err) return console.error(`Failed to read settings file for server ID ${path.basename(subdirectory)}\nError: ` + err);
                
                data = JSON.parse(data);
                settingsMap.set(path.basename(subdirectory), data);
            
                console.log(settingsMap);
            });
        });
    });

    return settingsMap;
}

function set(setting, value, settings, channel) {
    const boolSettings = ["logMessages", "deleteBannedPhrases", "banForBannedPhrases"];
    const numberSettings = ["maxMessageLength"];
    const stringSettings = ["prefix", "language"];

    let origValue;

    if (!setting) {
        return sendMsg("You have to specify which setting you want to change!", channel);
    }

    if (boolSettings.includes(setting)) {
        if (isBool(value)) {
            origValue = settings[setting];
            settings[setting] = value == "true";

            return sendMsg(`${setting} has been changed from "${origValue}" to "${value}"`, channel);
        }
        else {
            return sendMsg("This can only be set to true and false!", channel);
        }
    }
    else if (numberSettings.includes(setting)) {
        if (isNumber(value)) {
            origValue = settings[setting];
            settings[setting] = parseInt(value);

            return sendMsg(`${setting} has been changed from "${origValue}" to "${value}"`, channel);
        }
        else {
            return sendMsg("This can only be set to a number", channel);
        }
    }
    else if (stringSettings.includes(setting)) {
        origValue = settings[setting];
        settings[setting] = value;

        return sendMsg(`${setting} has been changed from "${origValue}" to "${value}"`, channel);
    }
    else {
        return sendMsg(`${setting} does not exist!`, channel);
    }
}

function write(settingsMap, directory) {
    console.log("\nWriting settings files");

    let keys = [...settingsMap.keys()];

    keys.forEach(key => {
        fs.writeFileSync(path.join(directory, key, 'settings.json'), JSON.stringify(settingsMap.get(key)), err => {
            if (err)
            return console.error(`\nFailed to save settings for server ID ${key}!\nError: ` + err);
        });
    });

    console.log("Completed writing settings files");
}

module.exports = {
    get,
    set,
    write
};