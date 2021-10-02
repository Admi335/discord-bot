const sendMsg = require('../discord/sendMsg.js');
const { isBool, isNumber } = require('../checkType.js');

module.exports = (setting, value, settings, channel) => {
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
};