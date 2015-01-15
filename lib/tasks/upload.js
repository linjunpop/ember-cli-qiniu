var Task        = require('ember-cli/lib/models/task');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');
var Qiniu       = require('node-qiniu');
var path        = require('path');
var walk        = require('walk');

module.exports = Task.extend({
  config: function(environment) {
    var configPath = path.join(this.project.root, 'config', 'qiniu');
    return require(configPath)(environment);
  },

  upload: function(config) {
    var ui = this.ui;
    var project = this.project;

    Qiniu.config({
      access_key: config.accessKey,
      secret_key: config.secretKey
    });

    var bucket = Qiniu.bucket(config.bucket);

    ui.startProgress("Uploading to Qiniu", '.');

    return new Promise(function(resolve, reject) {
      var distPath = path.join(project.root, 'dist');
      var walker  = walk.walk(distPath, { followLinks: false });

      walker.on('directories', function(root, dirStatsArray, next) {
        next();
      });
      walker.on('file', function(root, stat, next) {
        var filePath = path.join(root, stat.name);
        var distPath = path.join(project.root, 'dist');
        var key = filePath.replace(distPath + '/', '');

        var options = {
          scope: config.bucket + ':' + key
        };

        bucket.putFile(key, filePath, options, function(err, reply) {
          if (err) {
            var errorMessage = "Fail to upload: " + key + ", " + err.stack;
            return reject(new SilentError(errorMessage));
          }

          // console.dir(reply);
          ui.writeLine("Uploaded: " + key, 'INFO');
          next();
        });
      });
      walker.on("errors", function (root, nodeStatsArray, next) {
        next();
      });

      walker.on("end", function () {
        ui.writeLine("Upload successfully.", 'INFO');
        ui.stopProgress(true);
        return resolve();
      });
    });
  },

  run: function(environment) {
    var config = this.config(environment);

    return this.upload(config);
  }
});
