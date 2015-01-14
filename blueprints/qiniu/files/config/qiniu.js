/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    "accessKey": "",
    "secretKey": "",
    "bucket": "",
  };

  if (environment === "development") {
  }

  if (environment === "test") {
  }

  // export QINIU_ACCESS_KEY="Your Qiniu Access Key"
  // export QINIU_SECRET_KEY="Your Qiniu Secret Key"
  // export QINIU_BUCKET="Your Qiniu Bucket"
  // ember qiniu deploy --environment=production
  if (environment === "production") {
    ENV.accessKey = process.env.QINIU_ACCESS_KEY;
    ENV.secretKey = process.env.QINIU_SECRET_KEY;
    ENV.bucket = process.env.QINIU_BUCKET;
  }

  return ENV;
};
