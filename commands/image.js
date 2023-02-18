import { SlashCommandBuilder } from "discord.js";
const ping = new SlashCommandBuilder()
  .setName("image")
  .setDescription("Use the DALL-E API")
  .addStringOption((option) =>
  option
  .setName("prompt")
  .setDescription("Give instructions for the image")
  .setRequired(true)
  )

export default ping.toJSON();
