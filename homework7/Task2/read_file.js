import csv from "csv-parser";
import fs from "fs";

import path, { join } from "path";
function writeIntoJSON() {
  const filePath = process.argv[2];
  const csvFileName = path.basename(filePath);
  const jsonFileName =
    csvFileName.substring(0, csvFileName.lastIndexOf(".")) + ".json";
  const jsonFilePath = join("./converted", jsonFileName);
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const jsonStringifiyedData = JSON.stringify(results);
      fs.writeFile(jsonFilePath, jsonStringifiyedData, (err) => {
        if (err) throw err;
        console.log("Data written to file");
      });
    });
}
writeIntoJSON();
