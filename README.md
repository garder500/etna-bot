# etna-bot

A Discord bot built with discord.js v15, Prisma, and Bun.

## Features

- 🚀 Built with [Bun](https://bun.sh/) for fast performance
- 🤖 Discord.js v15 for Discord API integration
- 💾 Prisma ORM with SQLite database
- 📝 TypeScript for type safety
- 🔄 Hot reload during development
- 🛠️ devenv support for easy development environment setup

## Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher
- A Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))

## Setup

### 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd etna-bot
bun install
```

### 3. Configure Environment Variables

Copy the example environment file and configure your bot token:

```bash
cp .env.example .env
```

Edit `.env` and add your Discord bot token:

```env
DISCORD_TOKEN=your_actual_discord_bot_token_here
DATABASE_URL="file:./dev.db"
```

### 4. Setup Database

Initialize the Prisma database:

```bash
bun run db:generate
bun run db:migrate
```

### 5. Run the Bot

Development mode (with hot reload):
```bash
bun run dev
```

Production mode:
```bash
bun run start
```

## Development with devenv

If you're using [devenv](https://devenv.sh/), the environment will be automatically configured when you enter the directory (if you have direnv installed).

To set up direnv:

```bash
# Install direnv (if not already installed)
# On macOS
brew install direnv

# On Linux
curl -sfL https://direnv.net/install.sh | bash

# Hook direnv into your shell (add to ~/.bashrc or ~/.zshrc)
eval "$(direnv hook bash)"  # for bash
eval "$(direnv hook zsh)"   # for zsh

# Allow the .envrc file
direnv allow
```

## Available Scripts

- `bun run dev` - Start the bot in development mode with hot reload
- `bun run start` - Start the bot in production mode
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Prisma Studio to view/edit database

## Project Structure

```
etna-bot/
├── src/
│   └── index.ts          # Main bot entry point
├── prisma/
│   └── schema.prisma     # Prisma database schema
├── .env.example          # Example environment variables
├── .envrc               # devenv configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Creating Your Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - MESSAGE CONTENT INTENT (to read message content)
5. Copy your bot token and add it to `.env`
6. Go to OAuth2 > URL Generator:
   - Select `bot` scope
   - Select required permissions (e.g., Send Messages, Read Messages)
   - Copy the generated URL and use it to invite the bot to your server

## Adding Commands

Edit `src/index.ts` to add new commands. Example:

```typescript
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === '!hello') {
    await message.reply('Hello! 👋');
  }
});
```

## Database Models

The default Prisma schema includes basic `Guild` and `User` models. Modify `prisma/schema.prisma` to add your own models, then run:

```bash
bun run db:migrate
```

## License

See [LICENSE](LICENSE) file.
