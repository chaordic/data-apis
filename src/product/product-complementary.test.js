const { handler } = require('./product-complementary.js');

test('should export a handler function', () => {
  expect(typeof handler).toBe('function');
});

test('should throw error when input is undefined', async () => {
  await expect(handler(undefined)).rejects.toThrow(TypeError);
});

test('should throw error when input is null', async () => {
  await expect(handler(null)).rejects.toThrow(TypeError);
});
