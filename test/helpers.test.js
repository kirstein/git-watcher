var helpers = require('../src/helpers'),
    should  = require('should');

describe('helpers', function() {
  describe('#isString', function() {

    it('should figure out invalid strings', function() {
      helpers.isString(null).should.equal(false);
      helpers.isString({}).should.equal(false);
      helpers.isString().should.equal(false);
      helpers.isString(123).should.equal(false);
      helpers.isString(undefined).should.equal(false);
    });

    it('should figure out valid strings', function() {
      helpers.isString('').should.equal(true);
      helpers.isString('test').should.equal(true);
      helpers.isString(new String('test')).should.equal(true);
    });
  });

  describe('#isDefined', function() {

    it('should figure out undefined objects', function() {
      helpers.isDefined(undefined).should.equal(false);
      helpers.isDefined(null).should.equal(false);
      helpers.isDefined().should.equal(false);
    });

    it('should figure out defined objects', function() {
      helpers.isDefined({}).should.equal(true);
      helpers.isDefined('').should.equal(true);
      helpers.isDefined(123).should.equal(true);
      helpers.isDefined([]).should.equal(true);
    });
  });

  describe('#isFunction', function() {
    it('should figure out functions', function() {
      helpers.isFunction(function() {}).should.equal(true);
      helpers.isFunction(Function).should.equal(true);
    });

    it('should figure out non functions', function() {
      helpers.isFunction({}).should.equal(false);
      helpers.isFunction().should.equal(false);
      helpers.isFunction(null).should.equal(false);
      helpers.isFunction('').should.equal(false);
      helpers.isFunction(new String('asd')).should.equal(false);
    });
  });

  describe('#parseResults', function() {
    it('should return undefined if result is an empty string', function() {
      should.strictEqual(undefined, helpers.parseResults(''));
    });

    it('should return an array of changes', function() {
      helpers.parseResults('M\tasd1\nA\tasd2\nM\t\asd3\n').should.eql(['asd1', 'asd2', 'asd3']);
    });

    it('should remove undefined or zero length variables', function() {
      helpers.parseResults('M\t\nA\t\nM\t\asd3\n').should.eql(['asd3']);
    });
  });
});
