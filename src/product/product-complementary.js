const fs = require('fs');
const avro = require('avsc');
const axios = require('axios');

const parser = avro.Type.forSchema(fs.readFileSync('./product-complementary-schema.avsc'));

const hbaseNamespace = "product"
const hbaseTable = `${hbaseNamespace}:recommendation`

exports.handler = async ({ request_uri_args: args }) => {

	const { domain, cnpj, gtin } = args;
	const key = `${domain}${cnpj}${gtin}`
	console.log(key);

	try {
		const response = await axios.get(`http://hbase-rest.datalake.chaordicsystems.com/product:recommendation/${key}/value:value`, {timeout: 5000})
		if (response.status == 200) {
			const value = response.data['Row'][0]['Cell'][0]['$']
			const productComplementaryBinary = Buffer.from(value, 'base64')
			const productComplementaryJSON = parser.fromBuffer(productComplementaryBinary);
			console.log(`Parsed Rec:\n${JSON.stringify(productComplementaryJSON)}\n`); // FIXME remove this log after testing the API
		}
	} catch (exception) {
		console.error(exception); // eslint-disable-line no-console
	}

	return {statusCode: 200};
};
