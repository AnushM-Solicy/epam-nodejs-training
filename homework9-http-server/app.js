import { existsSync, mkdir, readdir, readFile, unlink, writeFile } from "fs";
import { join } from "path";
import http from "http";
import csv from "csv-parser";

const parsedFilesDirectory = "./converted";

function setupFolderForParsing() {
  return new Promise((resolve, reject) => {
    if (!existsSync(parsedFilesDirectory)) {
      mkdir(parsedFilesDirectory, (err) => {
        if (err) {
          console.log("Cannot create folder.");
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

function parseFile(fileAbsolutePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    const readStream = readFile(fileAbsolutePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const jsonFileName = fileAbsolutePath.replace(".csv", ".json");
        const jsonFilePath = join(parsedFilesDirectory, jsonFileName);
        const jsonStringifiedData = JSON.stringify(results);

        writeFile(jsonFilePath, jsonStringifiedData, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

function convertAllFiles(directoryPath) {
  return new Promise((resolve, reject) => {
    readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const promises = files.map((file) => {
        const fileAbsolutePath = join(directoryPath, file);
        return parseFile(fileAbsolutePath);
      });

      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.url == "/exports" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const { directoryPath } = JSON.parse(body);

      convertAllFiles(directoryPath)
        .then(() => {
          res.statusCode = 200;
          res.end("CSV files converted and saved as JSON.");
        })
        .catch((error) => {
          res.statusCode = 500;
          res.end(`Error converting files: ${error.message}`);
        });
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

const port = 3000;

setupFolderForParsing()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error :", error);
  });
