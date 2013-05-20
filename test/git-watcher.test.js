var should     = require('should'),
    path       = require('path'),
    sinon      = require('sinon'),
    GitWatcher = require('../src/git-watcher');

describe('Git-Watcher', function() {
  var fixtures = path.resolve('test/fixtures'),
      watcher, clock;

  beforeEach(function() {
    watcher = new GitWatcher(fixtures);
    clock   = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  describe('constructor', function() {
    it('should have exposed repository value', function() {
      watcher.repository.should.equal(fixtures);
    });
  });

  describe('#watch', function() {
    it('should have watch method', function() {
      watcher.watch.should.be.a('function');
    });

    it('should throw when no callback is defined', function() {
      (function() {
        watcher.watch();
      }).should.throw('No callback defined');
    });

    it('should start the timer right away', function() {
      watcher.poll = sinon.spy();
      should.not.exist(watcher._timeout);
      watcher.watch(function() {});
      watcher._timeout.should.exist;
    });

    it('should start polling right away', function() {
      watcher.poll = sinon.spy();
      watcher.watch(function() {});
      watcher.poll.calledOnce.should.be.true;
    });

    it('should set the timer timeout the given value', function() {
      watcher.poll = sinon.spy();
      watcher.watch(function() {}, 40000);
      clock.tick(40000);
      watcher.poll.callCount.should.equal(2);
    });

    it('should set the timer timeout the default value when not set', function() {
      watcher.poll = sinon.spy();
      watcher.watch(function() {}, GitWatcher.prototype.defaults.TIMEOUT);
      clock.tick(GitWatcher.prototype.defaults.TIMEOUT);
      watcher.poll.callCount.should.equal(2);
    });
  });

  describe('#poll', function() {
    it('should have poll method', function() {
      watcher.poll.should.be.a('function');
    });

    it('should throw when no callback is given', function() {
      (function() {
        watcher.poll();
      }).should.throw('No callback defined');
    });

    it('should pass commands to git', function(done) {
      watcher.poll(function(err, result) {
        done(err);
      });
    });
  });
});
