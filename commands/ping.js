import { SlashCommandBuilder } from "discord.js";
const ping = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export default ping.toJSON();
