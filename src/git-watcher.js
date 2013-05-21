var spawn   = require('child_process').spawn,
    helpers = require('./helpers');

function GitWatcher(repository, target) {
  this.repository = repository;
  this.target     = target || this.defaults.TARGET;
  this._timeout   = null;
}

GitWatcher.prototype._spawn = function(cmd, callback) {
  try {
    process.chdir(this.repository);

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
  } catch (err) {
    callback("Failed to initiate GitWatcher polling: " + err.message);
  }
};

GitWatcher.prototype.defaults = {
  TIMEOUT : 1000,
  TARGET  : 'origin/master'
};

GitWatcher.prototype.poll = function(callback) {
   if (!helpers.isFunction(callback)) {
    throw new Error('No callback defined');
  }

  var self = this;

  // Get the last comment hash
  this._spawn([ 'log', '-n', 1, this.target, '--oneline'], function(err, result) {
    if (err) {
      return callback(err);
    }

    // The latest commit hash
    var hash = result.split(' ')[0];

    // Don't poll if the remote hash has not changed
    if (hash === self._lastHash) {
      return;
    }

    // Build the polling target
    // If we have the last topmost commit hash then lets get the comments between the new topmost and last topmost
    var target = (self._lastHash || '') + '..' + hash;

    self._spawn([ 'diff',  '--name-status', target ], function(err, result) {
      if (err) {
        return callback(err, result);
      }

      self._lastHash = hash;

      var changes = helpers.parseResults(result);
      if (helpers.isDefined(changes)) {
        return callback(null, changes);
      }
    });
  });

  return this;
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

  return this;
};

module.exports = GitWatcher;
