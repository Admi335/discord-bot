function isBool(str) {
    return str == "true" || str == "false";
}

function isNumber(str) {
    return !((isNaN(str) && isNaN(parseFloat(str))) || parseInt(str) < -1)
}

module.exports = {
    isBool,
    isNumber
};