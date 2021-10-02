const sendMsg = require('./sendMsg.js')

module.exports = (user, reason, reasonLocation) => {

    user.ban();

    reason.trim();
    if (reason && reason != "")
        sendMsg(reason, reasonLocation);

}