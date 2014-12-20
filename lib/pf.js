'use strict';
var fs = require('fs');

module.exports = function(fileName, text, opts, cb) {
  if (!text) {
    process.nextTick(function() {
      cb('No data supplied');
    });
  }
  if (arguments.length === 3) {
    if (Object.prototype.toString.call(opts) === '[object Function]') {
      cb = opts;
    } else {
      process.nextTick(function() {
        cb('Callback missing!');
      });
    }
  }
  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      cb(err);
    } else {
      fs.unlinkSync(fileName);
      //lets remove previous annotation
      data = data.replace(/--\s*==(?:\r|\n|.)*--\s+/, '');
      data = data.replace(/\/\/\s*==(?:\r|\n|.)*\/\/\s+/, '');
      fs.writeFile(fileName, text + data, cb);
    }
  });
};