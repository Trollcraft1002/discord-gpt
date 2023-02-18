let counter = 0;
import * as fs from "fs";
function appendToFile(file, conversationLogs) {
     counter++;
    if (counter >= 10) {
      fs.writeFile(file, conversationLogs, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Conversation logs written to file.");
        var test =  Number(10-counter)
        return  test
      });
    } else {
      fs.appendFile(file, conversationLogs, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Conversation logs appended to file.");
      var test =  Number(10-counter)
        return  test
      });
    }
  }
  export {appendToFile}