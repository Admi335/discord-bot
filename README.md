# Discord bot

This program is a discord bot, made using a module for Node.js, discord.js, that allows you to interact with the Discord API.

## Getting Started

### Prerequisites

The list of software you need to install to launch the bot.
You can check if Node.js is installed on your computer by typing in the terminal or the cmd this command: "node -v". If it outputs something like this:

```bash
$ node -v
v17.1.0
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

3. ffmpeg

```bash
# Ubuntu
sudo apt-get install ffmpeg

#Fedora
sudo dnf install ffmpeg

# Arch linux
sudo pacman -S ffmpeg
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
https://www.ffmpeg.org/download.html

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
npm install discord.js @discordjs/rest discord-api-types @discordjs/opus discord-player ffmpeg fluent-ffmpeg

# or simply

npm install
```

## Deployment

For deploying the bot read [DEPLOYMENT.md](DEPLOYMENT.md)

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [discord.js](https://discord.js.org/) - Node.js module used for interacting with the Discord API
- [discord-player](https://discord-player.js.org/) - Complete framework to simplify the implementation of music commands using discords.js
- [FFmpeg](https://ffmpeg.org/) - Complete, cross-platform solution to record, convert and stream audio and video

## Authors

- **Adam Říha** - _Initial work_ - [Admi335](https://github.com/Admi335)

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details
