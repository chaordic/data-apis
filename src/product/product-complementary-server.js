const http = require('http');
const url = require('url');
const { handler } = require('./product-complementary');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const q = url.parse(req.url,true).query;
  handler({ request_uri_args: {domain: q.domain, cnpj: q.cnpj, gtin: q.gtin}})
    .then(responseFromHandler => {
	res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(responseFromHandler.body);
    })
    .catch(err => {
	console.log(err);
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/\ncurl "http://${hostname}:${port}?domain=xxx&cnpj=yyy&gtin=zzz"`);
});
