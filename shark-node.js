'use strict'

// TODO https://github.com/qubyte/fetch-ponyfill/blob/master/fetch-node.js

/*
 * Configure shark-fetch with Browser implementation
 */
const sharkFetch = require('./src/utils/shark-fetch')
const nodeFetch = require('node-fetch')
Object.assign(sharkFetch, {
  fetch: nodeFetch,
  Headers: nodeFetch.Headers,
  Request: nodeFetch.Request,
  Response: nodeFetch.Response
})

/*
 * Expose Shark clients
 */
const Shark = require('./src/shark')

Shark.ServiceTokenClient = require('./src/service-token/server')

module.exports = Shark
