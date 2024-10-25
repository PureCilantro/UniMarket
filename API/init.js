const fs = require('fs');
const folders = ['./users', './uploads'];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});