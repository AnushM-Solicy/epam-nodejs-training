import readline from 'readline';
import process from 'process';
import fs from 'fs'
import fspromises from 'fs/promises'
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
})

rl.on('line', (input) => {
    if (input === 'exit') {
        rl.close()
    }

    if (input === 'ls') {
        fspromises.readdir('./')
            .then((files) => {
                const dirFolders = [];
                const dirFiles = [];

                return Promise.all(
                    files.map((item) => {
                        return fspromises.stat(item)
                            .then((stats) => {
                                if (stats.isDirectory()) {
                                    dirFolders.push(item);
                                } else {
                                    dirFiles.push(item);
                                }
                            });
                    })
                )
                    .then(() => {
                        const sortedFolders = dirFolders.sort();
                        const sortedFiles = dirFiles.sort();
                        const sortedContents = [...sortedFolders, ...sortedFiles];

                        const formattedContents = sortedContents.map((item) => {
                            const fileType = fs.lstatSync(item).isDirectory() ? 'Folder' : 'File';
                            return `${item}${fileType === 'File' ? path.extname(item) : ''}\t${fileType}`;
                        });

                        console.log(formattedContents.join('\n'));
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }


    if (input.includes('add')) {
        const newFileName = input.split(' ')[1]
        fspromises.writeFile(`${newFileName}.txt`, '', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        })
    }

    if (input.includes('rn')) {
        const path = input.split(' ')[1]
        const newName = input.split(' ')[2] + '.txt'
        fs.rename(path, newName, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("File is renamed!");
            }
        });
    }

    if (input.includes('cp')) {
        const currPath = input.split(' ')[1]
        const newPath = input.split(' ')[2]
        const newDirectory = path.dirname(newPath)
        fspromises.mkdir(newDirectory, { recursive: true }).then(() => {
            fspromises.copyFile(currPath, newPath)
        })
    }

    if (input.includes('mv')) { //not working
        const currPath = input.split(' ')[1]
        const newPath = input.split(' ')[2]
        const newDirectory = path.dirname(newPath)
        fspromises.mkdir(newDirectory, { recursive: true }).then(() => {
            fspromises.rename(currPath, newPath)
        })
    }

    if (input.includes('rm')) {
        const path = input.split(' ')[1]
        fspromises.unlink(path, (err) => {
            if (err) {
                console.log('something went wrong')
            } else {
                console.log('file is deleted')
            }
        })
    }

    rl.prompt()


})


rl.on('close', () => {
    process.exit(0)
})