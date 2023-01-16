# Discord bot

This program is a Discord bot that allows you to interact with the Discord API, made using [discord.js](https://discord.js.org/).

## Getting Started

Before you can run the bot, you'll need to install some software.

### Prerequisites

- Node.js - check if it's installed by running **\`node -v\`** in your terminal. If it returns a version number, you're good to go. If not, you can download it from [nodejs.org](https://nodejs.org/en/download/)
- npm - this is included with Node.js, so you don't need to install it separately
- ffmpeg - download from [ffmpeg.org](https://www.ffmpeg.org/download.html)

#### Linux

Run the following commands in your terminal:

```bash
sudo apt-get install nodejs npm ffmpeg # Ubuntu
sudo dnf install nodejs # Fedora
sudo pacman -S nodejs # Arch linux
```

#### macOS

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"

# or

brew install node
```

Or you can install it from [nodejs.org](https://nodejs.org/en/download/package-manager/) and [ffmpeg.org](https://www.ffmpeg.org/download.html)

### Installing

1. Open your terminal and navigate to the folder where you want to install the bot.

```bash
cd [folder's name]
```

2. Clone or unzip the repository files in that folder.

```bash
git clone https://github.com/Admi335/raven-bot.git
```

3. Install the dependencies by running **\`npm install\`** in the project directory.

## Deployment

For information on deploying the bot, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [discord.js](https://discord.js.org/) - Node.js module for interacting with the Discord API
- [discord-player](https://discord-player.js.org/) - Framework to simplify the implementation of music commands using discord.js
- [FFmpeg](https://ffmpeg.org/) - Cross-platform solution for recording, converting, and streaming audio and video

## Authors

- **Adam Říha** - [Admi335](https://github.com/Admi335)

## License

This project is licensed under the GPLv3 License. You can refer to the [LICENSE](LICENSE) file for details.
