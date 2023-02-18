import mysql from "mysql2"
//const { Configuration, OpenAIApi } = require("openai");
import * as open from "openai";
//const config = require("../config.json");
import config from "../config.json" assert { type: "json" };
const configuration = new open.Configuration({
  apiKey: config.open_ai_key,
});
const openai = new open.OpenAIApi(configuration);

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUsername,
  password: config.dbPassword,
  database: config.dbDatabase
});

async function checkTable() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT 1 FROM conversation", function (error, results, fields) {
      if (error) {
        //table does not exist
        connection.query(
          "CREATE TABLE conversation (id INT AUTO_INCREMENT PRIMARY KEY, user_input TEXT, model_response TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
          function (err, results) {
            if (err) {
              reject(err)
            } else {
              console.log("Table created successfully");
              resolve(true);
            }
          });
      } else {
        console.log("Table already exists");
        resolve(true);
      }
    });
  });
}


let fileA = "./commands/logs/a.txt";
let fileB = "./commands/logs/b.txt";


async function GPT(model, prompt, max_tokens, id) {
  let startPrompt = "";
  if(id === "1066039167156506715"){
     startPrompt = fs.readFileSync(fileA).toString()
  }else{
    if (id === "1066039194704687183"){
      startPrompt = fs.readFileSync(fileB).toString()
    }
  }
  try {
    const completion = await openai.createCompletion({
      model: model,

      prompt: `${prompt}?\n`,
      temperature: 0.,
      max_tokens: max_tokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(completion.data.choices[0].text);
    let ans = completion.data.choices[0].text;
    if(checkTable()){
    connection.query(
      "INSERT INTO conversation (user_input, model_response) VALUES (?, ?)",
      [prompt, ans],
      function(err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log("Data inserted successfully");
        }
      }
    );
    }
    return ans;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      return error.response.status + " " + error.response.data;
    } else {
      console.log(error.message);
      return error.message;
    }
  }
}
export {GPT}
