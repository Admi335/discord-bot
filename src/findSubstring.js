module.exports = str => {
    
    let match = str.match(/(['"])((?:[^"\\]|\\.)*)(?=\1)/);
    return match ? match[2].replace(/\\(.)/g, "$1") : undefined;

}
