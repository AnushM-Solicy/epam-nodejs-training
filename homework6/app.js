import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>'
});

rl.on('line', (input) => {
  let inputFile = input.split(' ')[0];
  let outputFile = input.split(' ')[1];
  let operation = input.split(' ')[2]; // Changed index from 3 to 2

  if (operation == 'uppercase') {
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.log('Error:', err);
      } else {
        let upperCasedText = data.toUpperCase();
        fs.writeFile(outputFile, upperCasedText, (err) => {
          if (err) {
            console.log('Error:', err);
          } else {
            console.log('File written successfully.');
          }
        });
      }
    });
  } else if (operation == 'lowercase') {
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.log('Error:', err);
      } else {
        let lowerCasedText = data.toLowerCase();
        fs.writeFile(outputFile, lowerCasedText, (err) => {
          if (err) {
            console.log('Error:', err);
          } else {
            console.log('File written successfully.');
          }
        });
      }
    });
  } else if (operation == 'reverse') {
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.log('Error:', err);
      } else {
        let reversedText = data.split('').reverse().join('');
        fs.writeFile(outputFile, reversedText, (err) => {
          if (err) {
            console.log('Error:', err);
          } else {
            console.log('File written successfully.');
          }
        });
      }
    });
  } else {
    console.log('Please enter a valid command.');
  }

  rl.prompt();
});


