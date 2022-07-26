require('dotenv').config()
const { SlashCommandBuilder, Routes } = require('discord.js');
const {read} = require("./functions/file-management")
const { REST } = require('@discordjs/rest');
const { clientId, guildId } = require('./config.json');
const gearList = read('./gear.txt')
console.log(gearList)
const token = process.env.DISCORD_TOKEN
const commands = [
	new SlashCommandBuilder().setName('loan').setDescription('Loan Gears usage: /loan @person gearname').addUserOption(options=>options.setName('person').setDescription('Person borrowing the gear').setRequired(true)).addStringOption(option =>{
		option.setName('gearname')
			.setDescription('Gear to borrow')
			.setRequired(true)
			gearList.forEach((gear)=>option.addChoices(gear))
			return option
		}),
	new SlashCommandBuilder().setName('gearlist').setDescription("display the gears available"),
	new SlashCommandBuilder().setName('add').setDescription('add a new gear to loan list').addStringOption(option=>option.setName('gearname').setDescription('name of gear').setRequired(true)),
	new SlashCommandBuilder().setName('waitlist').setDescription("waitlist").addStringOption(option=>{option.setName('gearname')
	.setDescription("select waitlist")
	.setRequired(true)
	option.addChoices({name: "ALL GEARS", value:"ALLGEAR"})
	gearList.forEach((gear)=>option.addChoices(gear))
	return option
	}
	),
	new SlashCommandBuilder().setName('joinwaitlist').setDescription("Join waitlist").addStringOption((option) =>{
		option.setName('gearname')
			.setDescription('Gear to borrow')
			.setRequired(true)
			gearList.forEach((gear)=>option.addChoices(gear))
			return option
		}),

]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);