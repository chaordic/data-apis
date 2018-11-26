const { handler } = require('./metrics.js');
const CloudWatch = require('../utils/cloudwatch-utils.js');

jest.mock('../utils/cloudwatch-utils.js');

test('should export a handler function', () => {
  expect(typeof handler).toBe('function');
});

test('should throw error when input is undefined', () => {
  function handleException() {
    handler(undefined);
  }

  expect(handleException).toThrow(TypeError);
});

test('should throw error when input is null', () => {
  function handleException() {
    handler(null);
  }

  expect(handleException).toThrow(TypeError);
});

test('should throw error when putMetric fails', async () => {
  const input = {
    MetricName: 'El nombre',
    Service: 'La niña',
  };

  CloudWatch.putMetricData.mockRejectedValue(new Error());

  await expect(handler(input)).rejects.toThrow();
});

test('should return promise() when success', async () => {
  const input = {
    MetricName: 'El nombre',
    Service: 'La niña',
  };

  CloudWatch.putMetricData.mockResolvedValue('return');

  await expect(handler(input)).resolves.toBe('return');
  expect(CloudWatch.putMetricData).toHaveBeenCalled();
});
