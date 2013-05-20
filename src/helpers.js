exports.isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

exports.isString = function(obj) {
  return toString.call(obj) === '[object String]';
};

exports.isDefined = function(obj) {
  return typeof obj !== "undefined" && obj !== null;
};
