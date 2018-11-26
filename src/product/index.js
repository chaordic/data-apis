const { handler } = require('./product-complementary.js');
const request = {
	request_uri_args: {
		domain: 'mide',
		cnpj: '33014556001087',
		gtin: '7891361934980'
	}
};

(function () {
    handler(request);
})();
