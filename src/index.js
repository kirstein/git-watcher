var fs         = require('fs'),
    path       = require('path'),
    helpers    = require('./helpers'),
    GitWatcher = require('./git-watcher');

var DEFAULT_TIMEOUT = 1000;


function isValidRepository(repository) {
  var files = [],
      i, file, location;

  try {
    files = fs.readdirSync(repository);
    for (i = 0; i < files.length; i += 1) {
      file     = files[i];
      location = path.join(repository, file);

      if (fs.statSync(location).isDirectory() && file === '.git') {
        return true;
      }
    }
  } catch (e) {
    // ignore the exception, we don't care!
  }

  return false;
}

module.exports = function(repository, branch) {
   if (!helpers.isDefined(repository) || !helpers.isString(repository) || !repository.length) {
    throw new Error('No repository location defined');
  }

  var repo = path.resolve(repository);

  if (!isValidRepository(repo)) {
    throw new Error('Invalid repository location');
  }

  return new GitWatcher(repo, branch);
};
