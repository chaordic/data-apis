const CloudWatch = require('../utils/cloudwatch-utils.js');

const RECS_API_ENV = process.env.RECS_API_ENV || 'dev';

exports.handler = ({ MetricName, Service }) => (
  CloudWatch.putMetricData({
    MetricData: [{
      MetricName,
      Dimensions: [
        {
          Name: 'Environment',
          Value: RECS_API_ENV,
        },
        {
          Name: 'Service',
          Value: Service,
        },
      ],
      Timestamp: new Date(),
      Unit: 'Count',
      Value: 1,
    }],
    Namespace: 'RECS API',
  })
);
