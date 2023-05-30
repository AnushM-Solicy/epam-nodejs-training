import fsPromise from 'fs/promises'
import process from 'process';
import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
})

let oldName,
    newName

rl.prompt()

rl.question('enter the file you want to rename  ', (input) => {
    oldName = input
    rl.question('enter prefered name  ', (input) => {
        newName = input
        console.log(oldName, newName)

        fsPromise.rename(oldName, newName, function (err) {
            if (err) throw err;
            console.log('File Renamed.');
        })
    })
})

console.log('_____', oldName, newName)

