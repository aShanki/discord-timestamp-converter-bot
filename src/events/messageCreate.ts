import { Events, Message } from 'discord.js';
import { getUserTimezone } from '../database';
const chrono = require('chrono-node');
import { DateTime } from 'luxon';

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    const timezone = await getUserTimezone(message.author.id);
    if (!timezone) return;

    // Use the user's current time as the reference for parsing
    const now = DateTime.now().setZone(timezone);
    let results;
    try {
      results = chrono.parse(message.content, new Date());
      if (!results.length) return;

      // Only reply to the first time mention for simplicity
      const result = results[0];
      const parsedDate = DateTime.fromJSDate(result.start.date()).setZone(timezone);
      const timestamp = Math.floor(parsedDate.toSeconds());
      const formatted = `<t:${timestamp}:F>`;

      await message.reply({
        content: `They mean ${formatted}`,
        allowedMentions: { repliedUser: false }
      });
    } catch (err) {
      console.error('Error parsing message for time:', message.content, err);
      // Optionally, you could reply with a friendly error message or just silently fail
      return;
    }
  }
};
