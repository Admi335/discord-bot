const fs = require('fs');

module.exports = unloggedMesages => {

    unloggedMesages.forEach((value, key) => {
        if (value.length > 0) {
            let content = "";

            for (let i = 0; i < value.length; i++) {
                content += `User: ${value[i][0]}\nChannel: ${value[i][1]}\nContent:\n${value[i][2]}\n--------------------------------------\n\n`;
            }

            fs.writeFileSync(`./data/logs/${key}.log`, content, { flag: 'a+' }, err => {
                if (err)
                    return console.error("\nFailed to save logs!");
            });
        }
    });

    unloggedMesages.clear();

    return console.log("Messages succesfully logged!");
};