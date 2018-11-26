[![airbnb-style](https://img.shields.io/badge/eslint-airbnb-4B32C3.svg)](https://github.com/airbnb/javascript)

# Data APIs
Data APIs receives requests from Kong (only with valid JWT) and foward to our services.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
  - Node.js v8+
  - NPM

### Installing
```bash
npm install
```

## Deployment

It will deploy all functions to AWS Lambda. You can either choose DEV or PROD environments.

### DEV
```bash
npm run dev
```

### PROD
```bash
npm run prod
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
# <function> is the function name.
# <file> is the name of the file for the input event. You can create custom inputs to test your invocations.
```

### Logs
```bash
npx serverless logs -f <function>
# <function> is the function name.
```