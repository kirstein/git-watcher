var spawn   = require('child_process').spawn,
    helpers = require('./helpers');

function spawnGit(cmd, callback) {
  console.log(cmd.join(' '));
  var child  = spawn('git', cmd),
      result = '',
      error  = '';

  child.stdout.on('data', function (data) {
    result += data.toString();
  });

  child.stderr.on('data', function (data) {
    error  += data.toString();
  });

  child.on('close', function (code) {
    if (code > 0) {
      return callback(error);
    }
    callback(null, result);
  });
  child.stdin.end();
}

function GitWatcher(repository, branch) {
  this.repository = repository;
  this.branch     = branch;
  this._timeout   = null;
}

GitWatcher.prototype.defaults = {
  TIMEOUT : 1000
};

GitWatcher.prototype.poll = function(callback) {
   if (!helpers.isFunction(callback)) {
    throw new Error('No callback defined');
  }

  spawnGit([ 'diff-index',  '--name-only', 'HEAD', '--' ], function(err, result) {
    console.log(result);
    callback(err, result);
  });
};

GitWatcher.prototype.watch = function(callback, ms) {
  var self = this;

  if (!helpers.isFunction(callback)) {
    throw new Error('No callback defined');
  }

  // If the ms count is not set then use the default timeout
  ms = ms || this.defaults.TIMEOUT;

  var setTimer = function() {
    self._timeout = setTimeout(function() {
      self.poll(callback);
      setTimer();
    }, ms);
  };

  // Start polling right away
  this.poll(callback);

  // Start the timeout
  setTimer();
};

module.exports = GitWatcher;
