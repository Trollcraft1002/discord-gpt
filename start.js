import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  AttachmentBuilder,
} from "discord.js";
import * as fs from "fs";
import ping from "./commands/ping.js";
//import basic from "./commands/basic.js";
//import { getAccountBasic } from "./commands/functions/account.js";
import chat from "./commands/chat.js";
import { GPT } from "./commands/functions/chatGPT.js";
import image from "./commands/image.js";
import { DALL } from "./commands/functions/imageGen.js";
import { appendToFile } from "./commands/functions/log.js";
import config from "../config.json" assert { type: "json" };
DISCORD_TOKEN = config.DISCORD_TOKEN;
CLIENT_ID = config.CLIENT_ID;
GUILD_ID = config.GUILD_ID;

let fileA = "./commands/logs/a.txt";
let fileB = "./commands/logs/b.txt";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`✅ {PASS} ${client.user.username} connected to Gateway`);
});

client.on("messageCreate", async (message) => {
  try {
    console.log(message.author.username + ": " + message.content);
    if (message.author.bot) return;
    if (message.content === "admin") {
      if (message.author.id === "251025248751714305" || "479021067856511008") {
        message.channel.send(
          message.author.username + " have 1500 credits limit"
        );
      } else {
        message.channel.send(
          message.author.username + " is limited to 512 credits"
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
});
client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "ping") {
      await interaction.reply("Pong!");
    }
    if (interaction.commandName === "basic") {
      const username = interaction.options.get("username").value;
      const tag = interaction.options.get("tag").value;

      let data = await getAccountBasic(username, tag);
      console.log(data);

      await interaction.reply({
        content: data,
      });
    }
    let counter = appendToFile(fileA, "\n") - 10;
    counter = counter.valueOf(counter - 10);
    try {
      if (interaction.commandName === "chat") {
        let model = await interaction.options.get("model").value;
        let prompt = await interaction.options.get("prompt").value;
        let max_tokens = 512;
        if (
          interaction.user.id === "479021067856511008" ||
          "251025248751714305"
        ) {
          max_tokens = 1500;
        }
        await interaction.reply("Waiting GPT to finish...");
        let ans = await GPT(model, prompt, max_tokens).catch((err) => {
          console.log(err);
        });

        if (ans.length < 2000) {
          await interaction.editReply({
            content: `\`\`\`model: ${model} \nprompt: ${prompt} \ntokens: ${max_tokens} limited\`\`\` \nGPT: \`\`\`${ans}\`\`\``,
          });
        } else {
          let file = "./commands//logs/err.txt";
          fs.writeFile("./commands/logs/err.txt", ans, (err) => {
            if (err) {
              console.error(err);
            }
            // file written successfully
          });
          interaction.editReply({
            content:
              "Answer is above 2000 characters. Sending in .txt format...",
          });
          interaction.followUp({ files: [file] });
        }
        if (interaction.channel.id === "1066039167156506715") {
          let logCon = `Human: ${prompt} \n GPT: ${ans}\n`;
         // counter = appendToFile(fileA, logCon),toString();
        } else {
          if (interaction.channel.id === "1066039194704687183") {
            let logCon = `Human: ${prompt} \n GPT: ${ans}\n`;
           // counter = appendToFile(fileB, logCon).toString();
          }
        }
      }
      if (interaction.commandName === "image") {
        let prompt = await interaction.options.get("prompt").value;
        await interaction.reply("Waiting DALL-E to finish...");
        let image_url = await DALL(prompt).catch((error) => {
          console.log(error);
        });

        await interaction.editReply({ content: `prompt: ${prompt}` });
        await interaction.followUp({ content: image_url });
        console.log(image_url);
      }
    } catch (err) {
      console.log(err);
      await interaction.editReply({ content: `error: ${err}` });
    }
  }
});

async function main() {
  try {
    const commands = [ping, chat, image];

    console.log("✅ {PASS} Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("🔄 {PASS} Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("❌ {ERROR} " + error);
  }
}
main();

client.login(DISCORD_TOKEN);
