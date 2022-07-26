require("dotenv").config();
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const {
  UpdateCurrentHolder,
  readWaitList,
  writeWaitList,
  getGear,
  removeWaitList,
  read,
  incrementor,
  addGear,
  isEmptyObject,
} = require("./functions/file-management");
const token = process.env.DISCORD_TOKEN;
const { guildId } = require("./config.json");
const gearList = read("./gear.txt");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const role = interaction.member.roles.cache.has("960951544596029541");
  if (!role) {
    await interaction.reply("You must be active to borrow gears!!!");
    return;
  }

  const { commandName } = interaction;
  const user = interaction.user.id;
  if (commandName === "gearlist") {
    var count = 1;
    let text = "Gears Available:\n";
    gearList.forEach((gear) => {
      text += `${count}. ${gear.name}\n`;
      count += 1;
    });
    await interaction.reply(text);
  } else if (commandName === "add") {
    try {
      const gearName = interaction.options.getString("gearname");
      if (gearList.filter((gear) => gearName === gear.name).length === 0) {
        const value = incrementor("./value.json");
        const obj = {
          name: gearName,
          current: {},
          date: "",
          waitList: [],
          image: "",
        };
        addGear("./gear.txt", gearName, value, obj);
        await interaction.reply("Added Gear successfully");
        return;
      }
      await interaction.reply("Gear already exist");
    } catch (error) {
      console.log(error);
      await interaction.reply('Error')
      return
    }
  } else if (commandName === "waitlist") {
    const gear = interaction.options.getString("gearname");
    var text = readWaitList("./gear.json", gear);
    await interaction.reply(text);
  } else if (commandName === "loan") {
    try {
      let loaner = interaction.options.getMember("person");
      let takeover = loaner.user;
      let image = interaction.options.getAttachment("image");
      let image2 = interaction.options.getAttachment("image2");
      takeover["nickname"] = loaner["nickname"];
      takeover["url"] = image.url;
      takeover["url2"] = image2?.url;
      const gear = interaction.options.getString("gearname");
      if (
        user !== getGear("./gear.json", gear).current.id &&
        !isEmptyObject(getGear("./gear.json", gear).current)
      ) {
        await interaction.reply("You are not the current user!!!");
        return;
      }
      var preUser = UpdateCurrentHolder("./gear.json", takeover, gear);
      await interaction.reply(
        `${getGear("./gear.json", gear).name} given to ${
          takeover.nickname
        }\n Previous Owner: ${preUser}`
      );
    } catch (error) {
      console.log(error);
      await interaction.reply("Error");
      return;
    }
  } else if (commandName === "joinwl") {
    var nickname = interaction.member.nickname;
    var waitList = { nickname: nickname, id: user };
    var gearName = interaction.options.getString("gearname");
    writeWaitList("./gear.json", waitList, gearName);
    await interaction.reply(
      `You have successfully joined the queue for awesome gear (${gearName})`
    );
  } else if (commandName === "removewl") {
    const gear = interaction.options.getString("gearname");
    removeWaitList("./gear.json", user, gear);
    await interaction.reply(
      "Your name has been removed if it was in the waiting list."
    );
  } else if (commandName === "whelp") {
    var text =
      "Commands available:\n ```/loan [@person you want to pass the gear to [gearName] [imageEvidence] -Note: only the gear bearer is able to use this command```\n```/gearlist - list down all the available gears```\n ```/joinwl [@gearName] -join the queue for specific gear```\n```/removewl [@gearName] -remove yourself form specific gear queue```\n```/waitlist [@gearName] - check the waitlist and current user```\n```/add [@gearName] -add a new gear to the loan list``` \n```/wimage check the image evidence for accountability purposes```";
    await interaction.reply(text);
  } else if (commandName === "wimage") {
    try {
      const gear = interaction.options.getString("gearname");
      const gearDetails = getGear("./gear.json", gear).current;
      const url = gearDetails?.url;
      if (url) {
        var url2 = gearDetails?.url2;
        if (!url2) url2 = "No image 2";
        const file = "";
        const imageEmbed = {
          title: "Image Evidence:",
          image: {
            url: url,
          },
          fields: [
            { name: "Current Owner", value: gearDetails.nickname },
            { name: "Previous Owner", value: gearDetails.prev },
            { name: "Image 2 if any", value: url2 },
          ],
        };
        await interaction.reply({ embeds: [imageEmbed] });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});

// Login to Discord with your client's token
client.login(token);
