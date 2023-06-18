import { existsSync, mkdir, readdir } from "fs";
import { join } from "path";
import { Worker } from "worker_threads";

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
    const worker = new Worker("./read_file_worker.js", {
      workerData: { fileAbsolutePath },
    });

    worker.on("message", (message) => {
      console.log(`Worker: ${message}`);
    });

    worker.on("error", (err) => {
      reject(err);
    });

    worker.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

function main() {
  const filesDirectory = process.argv[2];
  return new Promise((resolve, reject) => {
    readdir(filesDirectory, (error, files) => {
      if (error) {
        console.log({ error });
        reject(error);
      }
      const promises = [];
      let workersCount = 0;
      for (const file of files) {
        const fileAbsolutePath = join(filesDirectory, file);
        promises.push(parseFile(fileAbsolutePath));
        workersCount++;
        if (workersCount === 10) {
          break;
        }
      }
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

setupFolderForParsing()
  .then(() => main())
  .then(() => {
    console.log("All files parsed successfully.");
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
