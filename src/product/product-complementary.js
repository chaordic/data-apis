const avro = require('avsc');
const axios = require('axios');

const parser = avro.parse(__dirname + '/product-complementary-schema.avsc');

const hbaseDNS = 'hbase-rest.datalake.chaordicsystems.com'
const hbaseTable = 'product:complementary'
const hbaseColumn = 'value:value'

exports.handler = async ({ request_uri_args: args }) => {
	const response = {};

	const { domain, cnpj, gtin } = args;
	const key = `${domain}${cnpj}${gtin}`

	try {
		const hbaseResponse = await axios.get(`http://${hbaseDNS}/${hbaseTable}/${key}/${hbaseColumn}`, {timeout: 5000})
		const value = hbaseResponse.data['Row'][0]['Cell'][0]['$']
		const productComplementaryBinary = Buffer.from(value, 'base64')
		const productComplementaryStr = parser.fromBuffer(productComplementaryBinary);

		response.body = productComplementaryStr;
		response.statusCode = 200;

	} catch (exception) {

		switch (exception.constructor) {
			case TypeError:
      case SyntaxError:
				response.statusCode = 500;
				break;
			default:
				response.statusCode = 400;
		}
	}
	return response;
};
