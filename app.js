require('dotenv').config()
const express = require('express')



const app = express()

const PORT = process.env.PORT || 3000

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { UpdateCurrentHolder, readWaitList, writeWaitList, getGear } = require('./functions/file-management');
const  token  = process.env.DISCORD_TOKEN
console.log(token)
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const { commandName } = interaction;
	const user = interaction.user.id
	if (commandName === 'gearlist') {
		await interaction.reply('Yet to implement');
	} else if (commandName === 'add') {
		await interaction.reply('Yet to implement');
	} else if (commandName === 'waitlist') {
		const gear = interaction.options.getString('gearname')
		var text = readWaitList('./gear.json',gear)
		await interaction.reply(text)
	} else if (commandName === 'loan') {
		const loaner = interaction.options.getUser('person')
		const gear = interaction.options.getString('gearname')
		var preUser = UpdateCurrentHolder('./gear.json', loaner, gear)
		preUser = preUser === 'No previous Owner' ? 'No previous Owner' : `<@${preUser.id}>`
		await interaction.reply(`${getGear('./gear.json',gear).name} given to <@${loaner.id}>\n Previous Owner: ${preUser}`)
		
	} else if (commandName ==='joinwaitlist') {
		var gearName = interaction.options.getString('gearname')
		writeWaitList('./gear.json', user, gearName)
		await interaction.reply(`You have successfully joined the queue for awesome gear (${gearName})`)
	}
});

app.listen(PORT, ()=>{
    console.log('Server is up on port '+ PORT)
})


// Login to Discord with your client's token
client.login(token);
