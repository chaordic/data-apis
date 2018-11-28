[![CircleCI](https://circleci.com/gh/chaordic/data-apis.svg?style=svg&circle-token=fc5cbcbeabe529c37b1acb0e667c00987ad7599c)](https://circleci.com/gh/chaordic/data-apis)
[![airbnb-style](https://img.shields.io/badge/eslint-airbnb-4B32C3.svg)](https://github.com/airbnb/javascript)

# ✟ ♱ RIP - IT'S A POC, it must be destroyed in the future ☦ ✟
* Project created for an apresentation to Linx P&D
* Need to re-think this project
* It's running in two AWS lambdas but this code isn't product ready (but it can be accessed by Linx guys and it's on linx share).


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
Export your API credentials to `LDAP_USER` and `LDAP_PASS` env variables.

### STORE ANALYTICS API
```
#get token
export JWT_TOKEN_ANALYTICS=`curl --http1.1 -XPOST "https://analytics.datalake.chaordicsystems.com/v1/token" -d '{"username": "'"$LDAP_USER"'", "password": "'"$LDAP_PASS"'"}' -H 'Content-Type: application/json' | jq .token -r`

#make requests

#simple request with simgle cnpj, domain and day
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_ANALYTICS}" "https://analytics.datalake.chaordicsystems.com/v1/store/?startDate=2018-01-02&endDate=2018-01-02&cnpj=00018084000190&domain=microvix" | jq .

#more complex request with multiple cnpjs, domains and a range of dates
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_ANALYTICS}" "https://analytics.datalake.chaordicsystems.com/v1/store/?startDate=2018-01-01&endDate=2018-01-11&cnpj=00018084000190&cnpj=97519672000140&cnpj=97519750000297&domain=microvix&domain=mide" | jq .

#interesting request, it's the request above beautyfied below, showing sales difference in the same cnpj but different domains
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_ANALYTICS}" "https://analytics.datalake.chaordicsystems.com/v1/store/?startDate=2018-01-01&endDate=2018-01-11&cnpj=00018084000190&cnpj=97519672000140&cnpj=97519750000297&domain=microvix&domain=mide" | jq '.[] | {"cnpj": .cnpj, "domain": .domain, "startDate": .startDate, "endDate": .endDate, "sum_of_sale_total_value": .sum_of_sale_total_value, "max_of_sale_total_value": .max_of_sale_total_value, "min_of_sale_total_value": .min_of_sale_total_value, "count_of_sales": .count_of_sales}'
```

### PRODUCT RECS API
```
#get token
export JWT_TOKEN_RECS=`curl --http1.1 -XPOST "https://recs.datalake.chaordicsystems.com/v1/token" -d '{"username": "'"$LDAP_USER"'", "password": "'"$LDAP_PASS"'"}' -H 'Content-Type: application/json' | jq .token -r`

#make requests

#rodape
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_RECS}" "https://recs.datalake.chaordicsystems.com/v1/product/?domain=mide&cnpj=83817858006705&gtin=7891444030622" | jq .

#bota
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_RECS}" "https://recs.datalake.chaordicsystems.com/v1/product/?domain=microvix&cnpj=11076356000206&gtin=7909422841822" | jq .

#tenis
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_RECS}" "https://recs.datalake.chaordicsystems.com/v1/product/?domain=microvix&cnpj=05852069000167&gtin=7909347941133" | jq .

#cha
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_RECS}" "https://recs.datalake.chaordicsystems.com/v1/product/?domain=microvix&cnpj=00954224001295&gtin=7898909639758" | jq .

#loçao corporal
curl --http1.1 -H "Authorization: Bearer ${JWT_TOKEN_RECS}" "https://recs.datalake.chaordicsystems.com/v1/product/?domain=microvix&cnpj=21297226000176&gtin=3614270665509" | jq .
```
