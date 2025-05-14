import fs from 'fs';

const folders = ['./temp'];

folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
});