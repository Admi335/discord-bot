const sendMsg = require('./sendMsg.js');

module.exports = (message, reason, reasonLocation) => {

    message.delete();

    reason.trim();
    if (reason && reason != "")
        sendMsg(reason, reasonLocation);
        
}