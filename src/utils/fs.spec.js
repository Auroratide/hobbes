const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { expect } = require('chai');
const { writeFile, readJson } = require('./fs');
const rimraf = require('rimraf');

describe('fs', () => {
  describe('writeFile', () => {
    it('should create the file before writing', () => {
      const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');
      rimraf.sync(tmpPath);

      return writeFile(path.resolve(tmpPath, 'file.txt'), 'content').then(() => {
        const files = fs.readdirSync(tmpPath);
        expect(files).to.contain('file.txt');
        rimraf.sync(tmpPath);
      }).catch(err => {
        rimraf.sync(tmpPath);
        throw err;
      });
    });
  });

  describe('readJson', () => {
    it('should return the JSON object', () => {
      const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');
      const obj = { field: 'value' };

      mkdirp.sync(tmpPath);
      fs.writeFileSync(path.join(tmpPath, 'file.json'), JSON.stringify(obj));
      
      return readJson(path.join(tmpPath, 'file.json')).then(data => {
        expect(data).to.deep.equal(obj);
      }).then(() => {
        rimraf.sync(tmpPath);
      }).catch(err => {
        rimraf.sync(tmpPath);
        throw err;
      });
    });
  });
});
