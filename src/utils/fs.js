const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const writeFile = (filepath, contents) => new Promise((resolve, reject) => {
  mkdirp(path.dirname(filepath), err => {
    if(err) {
      reject(err);
    } else {
      fs.writeFile(filepath, contents, err => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
});

const readJson = (filepath) => new Promise((resolve, reject) => {
  fs.readFile(filepath, (err, data) => {
    if(err) {
      reject(err);
    } else {
      resolve(JSON.parse(data));
    }
  });
});

module.exports = {
  writeFile,
  readJson
};
