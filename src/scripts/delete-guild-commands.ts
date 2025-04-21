import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) {
  throw new Error('DISCORD_TOKEN is not set in .env');
}
if (!clientId) {
  throw new Error('DISCORD_CLIENT_ID is not set in .env');
}
if (!guildId) {
  throw new Error('GUILD_ID is not set in .env');
}

const rest = new REST().setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    console.log('Successfully deleted all guild slash commands.');
  } catch (error) {
    console.error('Error deleting guild slash commands:', error);
  }
})(); 