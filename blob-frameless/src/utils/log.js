const fs = require('fs');
const path = require('path');

function createWriteStream(fileName) {
  const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName);
  const writeStrwam = fs.createWriteStream(fullFileName, {
    flags: 'a',
  });
  return writeStrwam;
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log');
function writeLog(writeStream, log) {
  writeStream.write(log + '\n');
}

function access(log) {
  writeLog(accessWriteStream, log);
}

module.exports = {
  access,
};
