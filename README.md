# Discord bot

This program is a discord bot, made using a module for Node.js, discord.js, that allows you to interact with the Discord API.

## Getting Started

### Prerequisites

The list of software you need to install to launch the bot.
You can check if Node.js is installed on your computer by typing in the terminal or the cmd this command: "node -v". If it outputs something like this:

```bash
$ node -v
v15.14.0
```

Node.js is installed on your computer and you can skip this part.

#### Linux

1. node.js

```bash
# Ubuntu
sudo apt-get install nodejs

# Fedora
sudo dnf install nodejs

# Arch linux
sudo pacman -S nodejs
```

2. npm

```bash
# Ubuntu
sudo apt-get install npm

# Fedora
# npm is already part of the Node.js package

# Arch linux
sudo pacman -S npm
```

#### macOS

1. node.js & npm

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"

# or

brew install node
```

Or you can install it from here:
https://nodejs.org/en/download/package-manager/

### Installing

A step by step installation guide for installing the bot using the terminal.
It's almost all the same for every operating system.
For Linux you can use the terminal of your distro, for macOS you can use the macOS' terminal and for Windows you can use the cmd.
Or you can use any other terminal like XTerm (for Linux) or Windows subsytem for Linux (for Windows - in VS Code).

1. Change the directory to the folder where you want to clone this repository

```bash
cd [folder's name]
```

2. Clone or unzip this repository's files in the folder

```bash
# If you have git installed
git clone https://github.com/Admi335/raven-bot.git

# otherwise unzip it with an unzip program
```

3. Install the modules

```bash
npm install discord.js ffmpeg fluent-ffmpeg @discordjs/opus ytdl-core genius-lyrics
```

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

5. Start the bot

```bash
npm run start
```

###

The bot should become online and working.

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [discord.js](https://discord.js.org/) - Node.js module used for interacting with the Discord API
- [ytdl](https://www.npmjs.com/package/ytdl) - YouTube downloader written in JavaScript
- [FFmpeg](https://ffmpeg.org/) - Complete, cross-platform solution to record, convert and stream audio and video
- [genius-lyrics](https://www.npmjs.com/package/genius-lyrics) - Simple lyrics fetcher that uses [Genius](https://genius.com/)

## Authors

- **Adam Říha** - _Initial work_ - [Admi335](https://github.com/Admi335)

## License

This project is licensed under the GPLv2 License - see the [LICENSE](LICENSE) file for details
