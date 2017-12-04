module.exports.shouldReject = promise => new Promise((resolve, reject) => {
  return promise.then(() => {
    reject('Promise was resolved but should have been rejected.');
  }).catch(err => {
    resolve(err);
  });
});
