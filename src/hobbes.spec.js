const { expect } = require('chai');
const hobbes = require('./hobbes');
const Contract = require('./contract');

describe('hobbes', () => {
  it('should create an empty contract', () => {
    expect(hobbes.contract({})).to.be.an.instanceof(Contract);
  });
});
