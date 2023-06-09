import { getProcessStats } from './app.js';

async function main() {
  try {
    const command = 'ls';
    const args = ['-l'];
    const timeout = 5000;

    await getProcessStats(command, args, timeout);
    console.log('Process statistics saved successfully.');
  } catch (err) {
    console.log('error:', err);
  }
}

main();