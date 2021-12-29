const sendMsg = async (content, location) => {
    return location.send(content);
}

const deleteMsg = (message, reason, reasonLocation) => {
    if (reason && reason.trim() != "")
        sendMsg(reason.trim(), reasonLocation);

    return message.delete(); 
}

const banUser = (user, reason, reasonLocation) => {
    if (reason && reason.trim() != "")
        sendMsg(reason.trim(), reasonLocation);

    return user.ban();
}

module.exports = {
    sendMsg,
    deleteMsg,
    banUser
}