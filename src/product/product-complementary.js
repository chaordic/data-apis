const productComplementarySchema = require('./product-complementary-schema.json');

exports.handler = async ({ request_uri_args: args }) => {
	console.log(productComplementarySchema);
	return {statusCode: 200};
};
