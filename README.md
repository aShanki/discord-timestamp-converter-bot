# Discord Timestamp Converter Bot

A Discord bot that automatically detects natural language time mentions in messages and replies with a Discord-formatted timestamp, adjusted to the user's timezone. Users can set their timezone using a slash command. The bot stores user timezones in MongoDB.

## Features
- **Automatic Time Detection:** Parses messages for natural language time expressions (e.g., "tomorrow at 5pm") and replies with a Discord timestamp (e.g., `<t:1234567890:F>`).
- **User Timezone Support:** Each user can set their timezone by city name using `/settimezone`.
- **Timezone Storage:** User timezones are stored in MongoDB for persistent, per-user customization.

## How It Works
1. **Set Timezone:**
   - Users run `/settimezone city:<city name>` (e.g., `/settimezone city:London`).
   - The bot geocodes the city, finds the timezone, and saves it for the user.
2. **Message Parsing:**
   - When a user with a set timezone sends a message, the bot parses it for time expressions using `chrono-node`.
   - If a time is found, the bot replies with a Discord timestamp, so users in any timezone can see the correct time.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- MongoDB database (local or cloud)
- A Discord bot application and token ([Discord Developer Portal](https://discord.com/developers/applications))

### Installation
1. **Clone the repository:**
   ```bash
   git clone <this-repo-url>
   cd discord-timestamp-converter-bot
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```
3. **Create a `.env` file:**
   Add the following variables:
   ```env
   DISCORD_TOKEN=your-bot-token
   DISCORD_CLIENT_ID=your-bot-client-id
   GUILD_ID=your-test-guild-id
   MONGODB_URI=your-mongodb-uri
   MONGODB_DATABASE=your-db-name
   ```
   - `DISCORD_TOKEN`: Your bot's token from the Discord Developer Portal.
   - `DISCORD_CLIENT_ID`: The client/application ID of your bot.
   - `GUILD_ID`: The Discord server (guild) ID where you want to register slash commands.
   - `MONGODB_URI`: MongoDB connection string.
   - `MONGODB_DATABASE`: Name of the database to use.

4. **Run the bot in development mode:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
   For production:
   ```bash
   pnpm build && pnpm start
   # or
   npm run build && npm start
   ```

## Usage
- **Set your timezone:**
  `/settimezone city:<city name>`
- **Send a message with a time:**
  - Example: `Let's meet tomorrow at 5pm!`
  - The bot will reply: `They mean <t:...:F>` (with the correct timestamp for your timezone)

## Notes
- The bot only replies to users who have set their timezone.
- Only the first time mention in a message is processed.
- The bot uses OpenStreetMap for geocoding city names.

## Contributing
Pull requests and issues are welcome!