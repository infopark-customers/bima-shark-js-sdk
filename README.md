# bima-shark-sdk (Javascript)

This is the Javascript SDK for the BImA applications.

[![Build Status](https://travis-ci.com/infopark-customers/bima-shark-js-sdk.svg?branch=develop)](https://travis-ci.com/infopark-customers/bima-shark-js-sdk)

### Installation

1) Install the npm package

```
npm install bima-shark-sdk
```

2) Bring your own `fetch` library.

* for browsers use [whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch) as polyfill for Internet Explorer
* in AWS Lambda functions use [node-fetch](https://www.npmjs.com/package/node-fetch)

> In pure browser enviroments without webpack:
> - run `npm run build`
> - copy ` dist/bima-shark-sdk.js ` into your app.

3) In browser you have to use `babel-loader` to support IE 11 and project-wide
`babel.config.js`. A `.babelrc` configuration is not enough and will ignore
node_modules.

```
  // webpack.config.js
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules/bima-shark-sdk')
          ],
          use: {
            loader: 'babel-loader'
          }
        },
        ...
```


### Usage

#### In browser

```js
import Shark from 'bima-shark-sdk'

Shark.configure({
  debug: false,             // log request and response, when true
  secret: 'random-id',      // user specific secret e.g. id
  serviceTokenUrl: '/doorkeeper/service_token'
})

import { UserClient } from 'bima-shark-sdk'

const client = new UserClient('https://doorkeeper-development.bundesimmo.de')
client.find(123)
  .then(
    json => { console.log('Success: ', json) },
    err => { console.log('Error: ', err) }
  ).finally(
    () => { console.log('Hide loader') }
  )
```

#### In Node.js

```js
const { MailingClient } = require('bima-shark-sdk')

const client = new MailingClient('https://mailing-development.bundesimmo.de', {
  serviceToken: {
    baseUrl: 'https://doorkeeper-development.bundesimmo.de',
    accessKey: 'your-access-key',
    secretKey: 'your-secret-key',
    userId: '1234567890'  // optional
  }
})

try {
  const json = await client.create({ foo: 'bar' })
  console.log('Success: ', json)
} catch (err) {
  console.log('Error: ', err)
}
```


### Testing

This SDK uses [jest](https://jestjs.io/) as test framework. Server responses are mocked with [nock](https://www.npmjs.com/package/nock).

```
npm ci
npm test
```


### Links for further reading

* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
* https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
