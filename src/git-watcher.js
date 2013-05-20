var spawn   = require('child_process').spawn,
    helpers = require('./helpers');

function GitWatcher(repository) {
  this.repository = repository;
  this._timeout   = null;
}

GitWatcher.prototype.defaults = {
  TIMEOUT : 1000
};

GitWatcher.prototype.poll = function(callback) {
   if (!helpers.isFunction(callback)) {
    throw new Error('No callback defined');
  }
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
