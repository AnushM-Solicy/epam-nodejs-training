import { spawn } from 'child_process';
import fs from 'fs';
import moment from 'moment';

export async function getProcessStats(cmd, args = [], timeout = Infinity) {
  let start = moment().toISOString();
  let duration;
  let success;
  let commandSuccess;
  let error;

  return new Promise((resolve, reject) => {
    const childProcess = spawn(cmd, args);

    childProcess.on('error', (err) => {
      commandSuccess = false;
      error = err.message;
      success = false;
      saveStats();
      resolve();
    });

    childProcess.on('exit', (code) => {
      duration = moment().diff(moment(start));
      commandSuccess = code === 0;
      success = true;
      saveStats();
      resolve();
    });

    if (timeout !== Infinity) {
      setTimeout(() => {
        childProcess.kill();
        duration = moment().diff(moment(start));
        commandSuccess = false;
        success = false;
        saveStats();
        resolve();
      }, timeout);
    }
  });

  function saveStats() {
    const stats = {
      start,
      duration,
      success,
      commandSuccess,
      error
    };

    const timestamp = moment().format('YYYYMMDDHHmmss');
    const filename = `${timestamp}${cmd}.json`;
    const filePath = `logs/${filename}`;

    const logsDir = 'logs';
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));
  }
}
