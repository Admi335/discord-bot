module.exports = str => {

    function findSubstring() {
        let quote = "\"";
        
        for (let i = 0; i < 2; i++) {
            let subStrI;

            do {
                subStrI = str.indexOf(quote);
            } while (subStrI != -1 && str[subStrI - 1] == "\\");

            if (subStrI != -1) {
                let subStrEnd = subStrI;
                
                do {
                    subStrEnd = str.indexOf(quote, subStrEnd + 1);
                } while (subStrEnd != -1 && str[subStrEnd - 1] == "\\");
                
                if (subStrEnd != -1) {
                    return str.substring(subStrI + 1, subStrEnd);
                }
            }

            if (i == 0) quote = "'";
            else        return undefined;
        }
    }

    return findSubstring();

}
