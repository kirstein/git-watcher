var helpers = require('../src/helpers');

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
});
