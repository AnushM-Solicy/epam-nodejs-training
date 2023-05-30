// import fs from 'fs'

// const myText = 'Now i am writing and then reading from file'

// fs.writeFileSync('./test.txt' , myText ,'utf8')
// const output = JSON.parse(fs.readFileSync('test.txt'))
// console.log(output)





// Node.js program to demonstrate
// the fsPromises.readFile() method
 
// Include fs module

import fs from 'fs'
import fspromise from 'fs/promises'

// Use fsPromises.readFile() method
// to read the file
fs.promises.readFile("text.txt")
    .then(function (result) {
        console.log("" + result);
    })
    .catch(function (error) {
        console.log(error);
    })