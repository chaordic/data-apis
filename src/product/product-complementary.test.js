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

test('should return statusCode 200 with body when product complementary exists', async () => {
  const response = {
    statusCode: 200
  };

  const request = {
    request_uri_args: {
      domain: 'microvix',
      cnpj: '10504766000168',
      gtin: '7909422433355'
    }
  };

  console.error = jest.fn(); // eslint-disable-line no-console

  await expect(handler(request)).resolves.toEqual(response);
  expect(console.error).not.toHaveBeenCalled(); // eslint-disable-line no-console
});
