// Generated by CoffeeScript 1.3.3
var createAdapter;

createAdapter = require('../adapters').createAdapter;

exports.createJournal = function(modeOptions) {
  var journal;
  return journal = createAdapter('journal', modeOptions.journal || {
    type: 'Memory'
  });
};
