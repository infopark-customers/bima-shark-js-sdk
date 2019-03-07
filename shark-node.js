'use strict'

/*
 * Configure proxy with Node.js implementation details
 */
const proxy = require('./src/proxy')
const nodeFetch = require('node-fetch')

proxy.fetch = nodeFetch
proxy.Headers = nodeFetch.Headers
proxy.Request = nodeFetch.Request
proxy.Response = nodeFetch.Response

proxy.uploadFile = require('./src/utils/upload-file-node')

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
const { isArray, isFunction, isObject, isString } = require('./src/utils/typecheck')

Shark.ServiceTokenClient = require('./src/service-token/node')
Shark.MailingClient = require('./src/clients/mailing-client')

Shark.fetch = require('./src/utils/simple-fetch')
Shark.isArray = isArray
Shark.isFunction = isFunction
Shark.isObject = isObject
Shark.isString = isString

module.exports = Shark
