# bima-shark-sdk (Javascript)

This is the Javascript SDK for the BImA applications.


### Installation

```
npm install --save bima-shark-sdk
```

For local development, when testing your package against our applications
```
# replace with your own absolute path
npm install --save /User/jdahlke/.../bima-shark-js-sdk
```


Add your own `fetch` library.

* for browsers use [whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch) as polyfill for Internet Explorer
* in AWS Lambda functions use [node-fetch](https://www.npmjs.com/package/node-fetch)

> In browser enviroments:
> - run `npm run build`
> - copy ` dist/bima-shark-sdk.js ` into your app.

### Usage

#### Configuration (optional)

```
import Shark from 'bima-shark-sdk'

Shark.configure({
  debug: false,             // log request and response, when true
  secret: 'random-id',      // user specific secret e.g. id
  serviceTokenUrl: '/doorkeeper/service_token'
})

import { UserClient } from 'bima-shark-sdk'
```

### Testing

This SDK uses [Mocha](https://mochajs.org/) as test framework. Server responses are mocked with [nock](https://www.npmjs.com/package/nock).

```
npm test
```


### About promises

If you add `then` multiple times, you are chaining methods that should be called in sequence, until an exception is thrown.
Exceptions in the then chain must be handled by `catch` declared after the `then`. If there's no `catch` after the `then`, this error will be triggered: `Uncaught (in promise) Error(…)`.

If you add `catch` multiple times, you are chaining methods that should be called when something goes wrong (in the `then` functions before).
However, the second `catch` in the chain will only be called if the first one re-throws the exception, and so forth.
When `catch` is triggered, the chain resumes on the next `then` declared after the `catch`.

The **catch()** method returns a `Promise` and deals with rejected cases only. It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`
(in fact, calling `obj.catch(onRejected)` internally calls `obj.then(undefined, onRejected)`).

[Source Stack Overflow](https://stackoverflow.com/questions/34222818/how-does-the-catch-work-in-a-native-promise-chain)


### Links for further reading

* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
* https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
