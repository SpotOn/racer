// Generated by CoffeeScript 1.3.3
var patternInterface, prefixInterface;

patternInterface = require('./channel-interface-pattern');

module.exports = prefixInterface = function(pubSub) {
  var patternApi;
  patternApi = patternInterface(pubSub);
  return {
    subscribe: function(subscriberId, prefix, ackCb) {
      return patternApi.subscribe(subscriberId, prefix, ackCb);
    },
    publish: function(msg) {
      return patternApi.publish(msg);
    },
    unsubscribe: function(subscriberId, prefix, ackCb) {
      return patternApi.unsubscribe(subscriberId, prefix, ackCb);
    },
    hasSubscriptions: function(subscriberId) {
      return patternApi.hasSubscriptions(subscriberId);
    },
    subscribedTo: function(subscriberId, prefix) {
      return patternApi.subscribedTo(subscriberId, prefix);
    }
  };
};