/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-cli-qiniu',

  includedCommands: function() {
    return {
      'qiniu': require('./lib/commands/qiniu')
    };
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  }
};
