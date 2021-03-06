// Generated by CoffeeScript 1.3.3
var JournalMemory, exports, transaction;

transaction = require('../transaction.server');

exports = module.exports = function(racer) {
  return racer.registerAdapter('journal', 'Memory', JournalMemory);
};

exports.useWith = {
  server: true,
  browser: false
};

exports.decorate = 'racer';

JournalMemory = function() {
  this.flush();
};

JournalMemory.prototype = {
  flush: function(cb) {
    this._txns = [];
    this._startId = (+(new Date)).toString(36);
    return typeof cb === "function" ? cb() : void 0;
  },
  startId: function(cb) {
    return cb(null, this._startId);
  },
  version: function(cb) {
    return cb(null, this._txns.length);
  },
  add: function(txn, opts, cb) {
    this._txns.push(txn);
    return this.version(cb);
  },
  eachTxnSince: function(ver, _arg) {
    var done, each, next, txns;
    each = _arg.each, done = _arg.done;
    txns = this._txns;
    if (ver === null) {
      return done();
    }
    next = function(err) {
      var txn;
      if (err) {
        return done(err);
      }
      if (txn = txns[ver++]) {
        return each(null, txn, next);
      }
      return done(null);
    };
    return next();
  },
  txnsSince: function(ver, clientId, pubSub, cb) {
    var since, txn, txns;
    since = [];
    if (!pubSub.hasSubscriptions(clientId)) {
      return cb(null, since);
    }
    txns = this._txns;
    while (txn = txns[ver++]) {
      if (pubSub.subscribedTo(clientId, transaction.getPath(txn))) {
        since.push(txn);
      }
    }
    return cb(null, since);
  }
};
