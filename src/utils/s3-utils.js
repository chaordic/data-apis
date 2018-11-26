const AWS = require('aws-sdk');

const S3 = new AWS.S3();

module.exports = {
  getObject(Bucket, Key) {
    return S3.getObject({ Bucket, Key }).promise();
  },
};
