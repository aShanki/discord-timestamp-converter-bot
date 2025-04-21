import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
// @ts-ignore: No types available for 'node-geocoder'
import NodeGeocoder from 'node-geocoder';
import { find as tzFind } from 'geo-tz';
import { setUserTimezone } from '../database';

const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settimezone')
    .setDescription('Set your timezone by city name')
    .addStringOption(option =>
      option.setName('city')
        .setDescription('Your city (e.g., London, New York)')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const city = interaction.options.getString('city', true);
    await interaction.deferReply({ ephemeral: true });
    try {
      const res = await geocoder.geocode(city);
      if (!res.length) {
        await interaction.editReply(`Could not find the city "${city}". Please try a more specific name.`);
        return;
      }
      const { latitude, longitude } = res[0];
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        await interaction.editReply('Failed to get coordinates for that city.');
        return;
      }
      const [timezone] = tzFind(latitude, longitude);
      await setUserTimezone(interaction.user.id, timezone);
      await interaction.editReply(`Your timezone has been set to **${timezone}** (based on ${city}).`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('An error occurred while setting your timezone. Please try again later.');
    }
  }
};
