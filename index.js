const fetch = require('node-fetch');
const { Client, Routes } = require('discord.js');

const ping = {
  name: 'ping',
  description: 'Pings the bot and shows the latency'
};

const commands = [ping];

const client = new Client({ intents: [] });

client.on('interactionCreate', (interaction) => {
  if (interaction.commandName === 'ping') {
    interaction.reply(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);  
  } else {
    interaction.reply('this command\'s response has not been added yet!');
  }
});

(async () => {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('Invalid token');
  }

  const ratelimitTest = await fetch(`https://discord.com/api/v9/invites/discord-developers`);
  if (!ratelimitTest.ok) {
    console.error('The node is currently being blocked by Discord.');
    process.exit(1);
  }

  try {
    await client.login(token);
    await client.rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('DONE | Application/Bot is up and running.');
  } catch (err) {
    console.error('Failed to login or set commands:', err);
    process.exit(1);
  }
})();
