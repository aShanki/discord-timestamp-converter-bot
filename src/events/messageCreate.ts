import { Events, Message } from 'discord.js';
import { getUserTimezone } from '../database';
const chrono = require('chrono-node');
import { DateTime } from 'luxon';

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    const timezone = await getUserTimezone(message.author.id);
    console.log(`User ${message.author.id} - Retrieved timezone: ${timezone}`);
    if (!timezone) return;

    // Use the user's current time as the reference for parsing
    const now = DateTime.now().setZone(timezone);
    console.log(`User ${message.author.id} - Timezone used for 'now': ${now.zoneName}`);
    let results;
    try {
      // Get the current offset in minutes for the user's timezone
      const offsetMinutes = now.offset;
      // Pass the user's current time (in their timezone) as the reference date and numeric timezone offset
      results = chrono.parse(message.content, { instant: now.toJSDate(), timezone: offsetMinutes });
      if (!results.length) return;

      // Only reply to the first time mention for simplicity
      const result = results[0];
      // Create Luxon DateTime directly from epoch milliseconds in the target timezone
      const jsDate = result.start.date();
      const parsedDate = DateTime.fromMillis(jsDate.getTime(), { zone: timezone });
      console.log(`User ${message.author.id} - Milliseconds: ${jsDate.getTime()}, Timezone: ${timezone}, Offset Used: ${offsetMinutes}, Parsed Date: ${parsedDate.toISO()}`);
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
