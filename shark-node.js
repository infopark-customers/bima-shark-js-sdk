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

proxy.uploadFile = require('./src/node/upload-file')
proxy.ServiceTokenClient = require('./src/node/service-token')

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
Shark.ServiceTokenClient = proxy.ServiceTokenClient

module.exports = Shark
