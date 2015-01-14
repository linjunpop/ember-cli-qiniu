var Task        = require('ember-cli/lib/models/task');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');
var Qiniu       = require('node-qiniu');
var path        = require('path');
var walk        = require('walk');

module.exports = Task.extend({
  setBucket: function(environment) {
    var configPath = path.join(this.project.root, 'config', 'qiniu');
    var config = require(configPath)(environment);

    Qiniu.config({
      access_key: config.accessKey,
      secret_key: config.secretKey
    });

    return Qiniu.bucket(config.bucket);
  },

  upload: function(bucket) {
    var ui = this.ui;
    var project = this.project;

    ui.pleasantProgress.start("Uploading to Qiniu", '.');

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

        bucket.putFile(key, filePath, function(err, reply) {
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
        ui.pleasantProgress.stop();
        return resolve();
      });
    });
  },

  run: function(environment) {
    var bucket = this.setBucket(environment);

    return this.upload(bucket);
  }
});
