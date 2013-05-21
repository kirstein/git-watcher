var should     = require('should'),
    path       = require('path'),
    sinon      = require('sinon'),
    helpers    = require('../src/helpers'),
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

    it('should pass commands to spawn', function() {
      var spy = sinon.spy();
      watcher._spawn = spy;
      watcher.poll(function() {});
      watcher._spawn.calledOnce.should.equal(true);
    });

    it('should pass default branch as log branch when no branch is defined', function() {
      var spy = sinon.spy();

      watcher._spawn = spy;
      watcher.poll(function() {});

      spy.args[0][0].should.include(watcher.defaults.TARGET);
    });

    it('should pass specified branch as log branch', function() {
      var spy = sinon.spy();

      watcher.target = 'test/branch';
      watcher._spawn = spy;
      watcher.poll(function() {});

      spy.args[0][0].should.include(watcher.target);
    });

    describe('with mocked spawn', function() {
      // Mock the spawn and return the callback with an result
      function mockSpawn(err, result) {
        watcher._spawn = function(cmd, cb) {
          cb(err, result);
        };
        sinon.spy(watcher, '_spawn');
      }

      it('should trigger callback with an result if spawn failed', function() {
        mockSpawn('test error');

        var spy = sinon.spy();
        watcher.poll(spy);

        spy.calledOnce.should.be.true;
        spy.args[0][0].should.equal('test error');
      });

      it('should call spawn twice', function() {
        mockSpawn(null, 'test');

        var spy = sinon.spy();
        watcher.poll(spy);

        watcher._spawn.calledTwice.should.be.true;
      });
    });

    describe('#_spawn', function() {
      it('should exist', function() {
        watcher._spawn.should.be.a('function');
      });

      it('should trigger an error in callback if something explodes (repository location)', function(done) {
        watcher.repository = "/this/will/explode";
        watcher._spawn([], function(err) {
          should.exist(err);
          done();
        });
      });

      it('should trigger an error in callback if something explodes (cmd)', function(done) {
        watcher._spawn('wat', function(err) {
          should.exist(err);
          done();
        });
      });
    });
  });
});
