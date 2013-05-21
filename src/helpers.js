var self = exports;

self.isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

self.isString = function(obj) {
  return toString.call(obj) === '[object String]';
};

self.isDefined = function(obj) {
  return typeof obj !== "undefined" && obj !== null;
};

self.parseResults = function(rawResults) {
  if (!self.isString(rawResults) || !rawResults.length) {
    return;
  }

  var results = rawResults.split('\n').map(function(line) {
    return line.split('\t')[1];
  }).filter(function(line) {
    return self.isString(line) && line.length;
  });

  return results;
};
