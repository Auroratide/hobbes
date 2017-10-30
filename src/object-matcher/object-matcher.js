function ObjectMatcher(obj) {
  this.obj = obj;
}

ObjectMatcher.prototype.matches = function(model) {
  if(typeof this.obj === 'object') {
    return Object.keys(model).reduce((currentlyMatches, key) => {
      return currentlyMatches && new ObjectMatcher(this.obj[key]).matches(model[key]);
    }, true);
  } else {
    return model === this.obj;
  }
};

module.exports = ObjectMatcher;