const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { writeFile } = require('./fs');
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
      });
    });
  });
});
