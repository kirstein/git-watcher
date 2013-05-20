var should   = require('should'),
    path     = require('path'),
    gitWatcher = require('../src'),
    GitWatcher = require('../src/git-watcher');

describe('git-watch', function() {

  describe('index', function() {
    it('should be a function', function() {
      gitWatcher.should.be.a('function');
    });

    it('should throw when no repository is defined', function() {
      (function() {
        gitWatcher();
      }).should.throw('No repository location defined');
    });

    it('should throw when no repository is empty', function() {
      (function() {
        gitWatcher('');
      }).should.throw('No repository location defined');
    });

    it('should throw when no repository is null', function() {
      (function() {
        gitWatcher(null);
      }).should.throw('No repository location defined');
    });

    it('should throw when repository location does not exist', function() {
      (function() {
        gitWatcher('does-not-exist');
      }).should.throw('Invalid repository location');
    });

   it('should throw when repository location exists but does not hold .git folder', function() {
      (function() {
        gitWatcher('/does/not/exist');
      }).should.throw('Invalid repository location');
    });

   it('should return GitWatcher function when the valid path is relative', function() {
     gitWatcher('.').should.be.an.instanceOf(GitWatcher);
    });

   it('should return GitWatcher function when the valid path is absolute', function() {
    gitWatcher(path.resolve('.')).should.be.an.instanceOf(GitWatcher);
   });
  });
});
