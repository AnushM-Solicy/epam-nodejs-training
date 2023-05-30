import readline from 'readline';
import os from 'os';
import process from 'process';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'

});

rl.prompt()

rl.on('line', (input) => {
    if (input === '.exit') {
        rl.close();
    }
    switch (input) {
        case '--username':
            console.log(`Hi ${process.env.USERNAME}!`);
            break;
        case '--homedir':
            console.log(`Home directory: ${process.env.HOME}`);
            break;
        case '--cpus':
            const cpus = os.cpus() //fix
            console.log('Overall CPUs:', cpus.length);
            cpus.forEach((cpu, index) => {
                console.log(`CPU ${index + 1}:`);
                console.log('Model:', cpu.model);
                console.log('Clock Rate:', cpu.speed / 1000, 'GHz');
            });
        case '--architecture':
            console.log(`This is your CPU architecture : ${process.arch}`);
        case '--hostname':
            console.log(`This is your hostname: ${os.hostname()}`) //fix
            break;
        case '--platform':
            console.log(`This is your hostname: ${process.platform()}`)
            break;
        case '--memory':
            console.log(`This is your memroy:${JSON.stringify(process.memoryUsage())}`)
            break;
        default:
            console.log('Invalid command,please try again');
            break;
    }
    rl.prompt();
});

rl.on('close', () => {
    console.log(`Goodbye ${process.env.USERNAME}!`);
    process.exit(0);
});
