import { SlashCommandBuilder } from "discord.js";
const basic = new SlashCommandBuilder()
  .setName("chat")
  .setDescription("Use the OpenAI API")
  .addStringOption((option) =>
    option
      .setName("model")
      .setDescription("Please specift a model (prices are different)")
      .setRequired(true)
      .setChoices(
        {
          name: "Ada",
          value: "text-ada-001",
        },
        {
          name: "Babbage",
          value: "text-babbage-001",
        },
        {
          name: "Curie",
          value: "text-curie-001",
        },
        {
          name: "Davinci(TESTS ONLY)",
          value: "text-davinci-003",
        }
      )
  )
  .addStringOption((option) =>
    option
      .setName("prompt")
      .setDescription("Give the AI instructions")
      .setRequired(true)
  );
export default basic.toJSON();
