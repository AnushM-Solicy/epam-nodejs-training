import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { workerData, parentPort } from "worker_threads";

function writeIntoJSON() {
  return new Promise((resolve, reject) => {
    const filePath = workerData.fileAbsolutePath;
    const csvFileName = path.basename(filePath);
    const jsonFileName =
      csvFileName.substring(0, csvFileName.lastIndexOf(".")) + ".json";
    const jsonFilePath = path.join("./converted", jsonFileName);
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const jsonStringifiedData = JSON.stringify(results);
        fs.writeFile(jsonFilePath, jsonStringifiedData, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Data written to file: ${jsonFileName}`);
            resolve();
          }
        });
      });
  });
}

writeIntoJSON()
  .then(() => {
    parentPort.postMessage("File parsed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error occurred in worker:", error);
    process.exit(1);
  });
