import { SlashCommandBuilder } from "discord.js";
const basic = new SlashCommandBuilder()
  .setName("basic")
  .setDescription(
    "This will give you the region, puuid and acc level information"
  )
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("Account username")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("tag").setDescription("Account tag").setRequired(true)
  );
export default basic.toJSON();
