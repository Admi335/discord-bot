# Deployment

This guide will walk you through the steps necessary to deploy the Discord bot on your server.

### NOTE: This bot must be deployed under the GPLv3 license, as per the terms and conditions of the GNU General Public License.

## Setting up the bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Set up the bot by assigning it a name and creating a bot account for it.
3. Go to the "OAuth2" tab and select the permissions you want the bot to have.
4. Generate an invite link for the bot and use it to add the bot to your server.
5. Take note of the bot's token, which can be found on the "Bot" tab of your application.

## Configuring the bot

1. Create a file called **\`config.json\`** in the root directory of the bot's files.
2. In the **\`config.json\`** file, add the bot's token like so:

```json
{
  "token": "YOUR_TOKEN_HERE"
}
```

## Optional steps

### Data storage

1. Create a folder called **\`data\`** in the root directory of the bot's files.
2. The bot will use this folder to store data such as server settings and logged messages.

### Blacklisted phrases

1. Create a file called **\`phrases_blacklist.txt\`** in the root directory of the bot's files.
2. In this file, add any phrases that you want to be blacklisted by the bot, one per line.
3. The bot will ignore any lines that start with "!--" (comments).
4. The bot will ignore case when checking for blacklisted phrases.

### Addons

1. Create a folder called **\`addons\`** in the root directory of the bot's files.
2. Place any custom JavaScript files in this folder.
3. These files will be run alongside the bot and can be easily shared and modified without modifying the original code.
4. Each addon must have an exported function and one input argument, the Discord client. Here is the template for such function:

```javascript
module.exports = client => {
  // Put your custom code, which will then be run, here
}
```

## Starting the bot

1. Open a terminal window and navigate to the root directory of the bot's files.
2. Run the following command to start the bot:

```bash
npm run start
```
