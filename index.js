var spawn = require('child_process').spawn,
    fs    = require('fs');

var DEFAULT_TIMEOUT = 1000;

function isString(obj) {
    return toString.call(obj) == '[object String]';
}

exports.watch = function(repository, callback, timeout) {
  timeout = timeout || DEFAULT_TIMEOUT;

  if (!isString(repository)) {
    throw new Error('No repository location defined');
  } else if (!fs.existsSync(repository)) {
    throw new Error('Invalid repository location');
  } else {

  }
}
