import * as open from "openai";
import config from "../config.json" assert { type: "json" };
const configuration = new open.Configuration({
    apiKey: config.open_ai_key,
  });
  const openai = new open.OpenAIApi(configuration);

  async function DALL(prompt) {
    const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
       
      return response.data.data[0].url;
}
export {DALL}