[![airbnb-style](https://img.shields.io/badge/eslint-airbnb-4B32C3.svg)](https://github.com/airbnb/javascript)

# Data APIs
A bunch of AWS lambdas called by Kong (only with valid JWT) working as APIs that receives an object with request_uri_args attribute and returns an object with statusCode and body attributes.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
  - Node.js v8+
  - NPM

### Installing dev dependencies
```bash
npm run install-all
```

## Deployment

It will deploy each function to AWS Lambda. You can either choose DEV or PROD environments.

### PRODUCT RECS API DEV
```bash
npm run deploy-product-dev
```

### PRODUCT RECS API PROD
```bash
npm run deploy-product-prod
```

### STORE ANALYTICS API DEV
```bash
npm run deploy-analytics-dev
```

### STORE ANALYTICS API PROD
```bash
npm run deploy-analytics-prod
```

## Tests

### Unit
It will check each function general behavior. It uses [Jest](http://jestjs.io/en/) as test runner.
```bash
npm test
```

### ESlint
It will check for code structure errors and patterns (only `.js` files).
```bash
npm run eslint
```

### ECLint
It will check for file structure, such as tabs/spaces, end of file and so on. Check `.editorconfig` for default configurations.
```bash
npm run eclint
```

## Invoking
You can invoke functions directly from your terminal without opening AWS console and also check its logs.

### Invoke
```bash
npx serverless invoke -f <function> -p data-mock/<file>.json
# <function> is the function name. By now the only available function is 'customer'
# <file> is the name of the file for the input event. You can create custom inputs to test your invocations.
```

### Logs
```bash
npx serverless logs -f <function>
# <function> is the function name. By now the only available function is 'customer'
```

## Sample requests
### STORE ANALYTICS API
```
curl --http1.1 -H 'Authorization: Bearer ${TOKEN}' 'https://analytics.datalake.chaordicsystems.com/v1/store/?startDate=2018-01-01&endDate=2018-01-11&cnpj=19669737000391&cnpj=27881371000186&domain=microvix' | jq .
```

### PRODUCT RECS API
```
curl --http1.1 -H 'Authorization: Bearer ${TOKEN}' 'https://recs.datalake.chaordicsystems.com/v1/product/?domain=mide&algorithm=FPGrowth&cnpj=83817858006373&gtin=7891444030417' | jq .
```
