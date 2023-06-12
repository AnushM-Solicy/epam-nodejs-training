import { spawn } from "child_process";
import { existsSync, mkdir, readdir } from "fs";
import { join } from "path";
const parsedFilesDirectory = "./converted";
function setupFolderForParsing() {
    if (!existsSync(parsedFilesDirectory)) {
        mkdir(parsedFilesDirectory, (err) => {
            console.log("Cannot create folder.");
        });
    }
}

function main() {
    const filesDirectory = process.argv[2];
    readdir(filesDirectory, (error, files) => {
        if (error) console.log({ error });
        for (const file of files) {
            const fileAbsolutePath = join(filesDirectory, file);
            const executionStartTime = new Date();
            const child = spawn("node", ["read_file.js", fileAbsolutePath]);

            child.stdout.on("data", (data) => {
                console.log(`child ${file} stdout: ${data}`);
            });
            child.stderr.on("data", (data) => {
                console.error(`child ${file} stderr: ${data}`);
            });
            child.on("exit", function (code, signal) {
                const executionEndTime = new Date();
                const exectutionDuration =
                    executionEndTime.getTime() - executionStartTime.getTime();
                console.log(
                    `Child process exectuion time for parsing ${file} was ${exectutionDuration} milliseconds.`
                );
            });
        }
    });
}
setupFolderForParsing();
main();
