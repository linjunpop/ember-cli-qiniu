module.exports = {
  name: 'qiniu',
  description: 'Deploys an ember-cli app to qiniu',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'production' }
  ],

  run: function(commandOptions, rawArgs) {
    var UploadTask = require('../tasks/upload');
    var BuildTask = this.tasks.Build;

    var uploadTask = new UploadTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    var buildTask = new BuildTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    var buildOptions = {
      environment: commandOptions.environment || 'production',
      outputPath: "dist/",
      watch: false,
      disableAnalytics: false
    };

    return buildTask.run(buildOptions)
      .then(function() {
        return uploadTask.run(commandOptions.environment);
      })
      .then(function() {
        // return deployIndexTask.run(commandOptions);
      });
  }
};
