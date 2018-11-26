const hbase = require('hbase');
const avro = require('avro-js');
const Lambda = require('../utils/lambda-utils.js');
const recAvroSchema = require('./product-rec-schema.json');

const hbaseClient = hbase({ host: 'hbase-rest.datalake.chaordicsystems.com', port: 80 });

exports.handler = async ({ request_uri_args: args }) => {
  const response = {
    statusCode: 200,
  };

  try {
    //FIXME remember this algorithm is being passed, but not used yet.
    const { domain, algorithm, cnpj, gtin } = args;
    const table = `product:recommendation`;
    const key = `${domain}${cnpj}${gtin}`;

    const promise = new Promise((res, rej) => {
      hbaseClient
        .table(table)
        .row(key)
        .get('value:value', (err, result) => {
          if (err) {
            rej(err);
          } else {
            res(result[0].$);
          }
        });
    });

    const recAvroString = await promise;
    const recAvroBuffer = Buffer.from(recAvroString, 'binary');
    const recAvroType = avro.parse(recAvroSchema);

    // FIXME get real rec from buffer
    //const realRec = recAvroType.fromBuffer(recAvroBuffer);

    response.body = recAvroString//realRec;
  } catch (exception) {
    console.error(exception); // eslint-disable-line no-console

    switch (exception.constructor) {
      case TypeError:
      case SyntaxError:
        response.statusCode = 500;
        break;
      default:
        response.statusCode = 404;
    }
  }

  return response;
};
