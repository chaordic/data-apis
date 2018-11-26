const avro = require('avro-js');
const hbase = require('hbase');

const productComplementarySchema = require('./product-complementary-schema.json');

const hbaseClient = hbase({ host: 'hbase-rest.datalake.chaordicsystems.com', port: 80 });
const hbaseNamespace = "product"
const hbaseTable = `${hbaseNamespace}:recommendation`


exports.handler = async ({ request_uri_args: args }) => {

	const { domain, cnpj, gtin } = args;
	const key = `${domain}${cnpj}${gtin}`
	console.log(key);

	console.log(productComplementarySchema);
	try {
		const promise = new Promise((res, rej) => {
			hbaseClient
				.table(hbaseTable)
				.row(key)
				.get('value:value', (err, result) => {
					if (err) {
						rej(err);
					} else {
						res(result[0].$);
					};
				})
		});

		const productComplementaryBinary = await promise;

		const productComplementaryBuffer = Buffer.from(productComplementaryBinary, 'binary');
		const productComplementaryAvroParser = avro.parse(productComplementarySchema);

		const productComplementaryJSON = productComplementaryAvroParser.fromBuffer(productComplementaryBuffer);

		console.log(`Parsed Rec:\n${JSON.stringify(productComplementaryJSON)}\n`); // FIXME remove this log after testing the API
	} catch (exception) {
		console.error(exception); // eslint-disable-line no-console
	}

	return {statusCode: 200};
};
