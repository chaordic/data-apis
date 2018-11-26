const AWS = require('aws-sdk');

const CloudWatch = new AWS.CloudWatch();

module.exports = {
  putMetricData(params) {
    return CloudWatch.putMetricData(params).promise();
  },
};
