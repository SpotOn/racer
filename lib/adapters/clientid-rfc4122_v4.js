// Generated by CoffeeScript 1.3.3
var ClientIdRfc4122_v4, exports, uuid;

uuid = require('node-uuid');

exports = module.exports = function(racer) {
  return racer.registerAdapter('clientId', 'Rfc4122_v4', ClientIdRfc4122_v4);
};

exports.useWith = {
  server: true,
  browser: false
};

exports.decorate = 'racer';

ClientIdRfc4122_v4 = function(_options) {
  this._options = _options;
};

ClientIdRfc4122_v4.prototype.generateFn = function() {
  var buffer, offset, options, _ref;
  _ref = this._options, options = _ref.options, buffer = _ref.buffer, offset = _ref.offset;
  return function(callback) {
    var clientId;
    clientId = uuid.v4(options, buffer, offset);
    return callback(null, clientId);
  };
};
