const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const writeJson = (filepath, contents) => new Promise((resolve, reject) => {
  mkdirp(path.dirname(filepath), err => {
    if(err) {
      reject(err);
    } else {
      fs.writeFile(filepath, JSON.stringify(contents, null, 2), err => {
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
  writeJson,
  readJson
};
