const { handler } = require('./product-complementary.js');
const request = {
	request_uri_args: {
		domain: 'microvix',
		cnpj: '10504766000167',
		gtin: '7909422433355'
	}
};

(function () {
    handler(request);
})();
