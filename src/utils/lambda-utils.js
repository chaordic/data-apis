const AWS = require('aws-sdk');

const Lambda = new AWS.Lambda();

module.exports = {
  invoke(params) {
    return Lambda.invoke(params).promise();
  },
};
