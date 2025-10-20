require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '60000', 10);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function randomHexColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  const guild = await client.guilds.fetch(GUILD_ID);
  const botMember = await guild.members.fetch(client.user.id);
  const highestBotRole = botMember.roles.highest;

  setInterval(async () => {
    try {
      const role = await guild.roles.fetch(ROLE_ID);
      if (!role) return console.log('⚠️ Role not found');
      if (highestBotRole.position <= role.position)
        return console.log('⚠️ Bot role is lower than target role — move it above in server settings.');

      const newColor = randomHexColor();
      await role.edit({ color: newColor });
      console.log(`🎨 Changed role ${role.name} color to ${newColor}`);
    } catch (err) {
      console.error('❌ Error changing color:', err);
    }
  }, INTERVAL_MS);
});

client.login(TOKEN);
