## Deployment

### NOTE: YOU MUST DEPLOY IT UNDER THE GPL LICENSE, ACCORDING TO THE GNU GENERAL PUBLIC LICENSE TERMS AND CONDITIONS

To deploy the bot go to this website: https://discord.com/developers/applications, sign in or sign up, create a new application and set the application up. Then go to this website: https://discordapi.com/permissions.html, tick what you need, fill in the Client ID, which can be obtained form the applications page, add the bot to your Discord server and put the token of your bot in the config.json file (the token can be found on the application page as well).

###

After all of that, enter this into the terminal or cmd:

###

1. Change the directory to where you have the files from this repo

```bash
cd [path to the directory]
```

2. Create a config.json file and put your bot's token in it. The config.json file without the token should look like this:

```json
{
  "token": ""
}
```

3. (Optional) To be able to store data like server settings or logged messages, create a folder and name it "data" in the root directory of the project

```bash
mkdir data
```

4. (Optional) If you want to, you can create a text file with a list of blacklisted phrases called "phrases_blacklist.txt"

```bash
touch phrases_blacklist.txt
```

There, you can include phrases that you want to be blacklisted. Each phrase has to be on its own line. You don't have to worry about cases, the bot handles them for you. If you don't want a certain line to be included, prefix it with a "!--". Here is an example of how the file can look like:

```
!-- This is a comment
Bad word
another bad word
```

5. (Optional) To add custom functionality to the bot, you can create a folder called addons, where you can save your JavaScript files, which will be run alongside the bot.
The advantage of doing this is that addons can be easily shared and you don't have to modify the original code.

```bash
mkdir addons
```

Every addon has an export function and one input argument, the Discord client.

```javascript
module.exports = client => {
  // Put your custom code, which will then be run, here
}
```

6. Start the bot

```bash
npm run start
```

###

The bot should become online and working.
