require('dotenv').config();  // Load environment variables from .env file

const { Client, GatewayIntentBits } = require('discord.js');
const { spawn } = require('child_process');

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Channel ID where the bot is allowed to execute commands
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID;

// When the bot is ready
client.once('ready', () => {
    console.log('Bot is online!');
});

// Track the running processes for each channel
const runningProcesses = {};

// Listen for messages
client.on('messageCreate', (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if the message is in the allowed channel
    if (message.channel.id !== ALLOWED_CHANNEL_ID) return;

    // Check if the message starts with the command prefix
    const prefix = process.env.PREFIX || 'ssh';
    if (message.content.startsWith(prefix)) {
        // Extract the command and arguments
        const command = message.content.slice(prefix.length).trim();
        const [cmd, ...args] = command.split(' ');

        // Terminate any previous process in this channel
        if (runningProcesses[message.channel.id]) {
            runningProcesses[message.channel.id].kill('SIGTERM');
        }

        // Spawn a new process
        const process = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
        runningProcesses[message.channel.id] = process;

        // Handle stdout data
        process.stdout.on('data', (data) => {
            message.channel.send(`\`\`\`${data.toString()}\`\`\``).catch(console.error);
        });

        // Handle stderr data
        process.stderr.on('data', (data) => {
            message.channel.send(`stderr: ${data.toString()}`).catch(console.error);
        });

        // Handle process exit
        process.on('close', (code) => {
            message.channel.send(`Process exited with code ${code}`).catch(console.error);
            delete runningProcesses[message.channel.id];
        });

        // Handle errors with the spawn process
        process.on('error', (error) => {
            message.channel.send(`Error: ${error.message}`).catch(console.error);
            delete runningProcesses[message.channel.id];
        });
    } else if (runningProcesses[message.channel.id]) {
        // If there's a running process, send the message to it
        runningProcesses[message.channel.id].stdin.write(message.content + '\n');
    }
});

// Log in to Discord with your bot token
client.login(process.env.DISCORD_BOT_TOKEN);
