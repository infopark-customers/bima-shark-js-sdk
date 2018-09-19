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
 * Configure shark-upload-file with Browser implementation
 */
const { uploadFileNode } = require('./src/utils/upload-file')
const sharkUploadFile = require('./src/utils/shark-upload-file')
Object.assign(sharkUploadFile, {
  uploadFile: uploadFileNode
})

/*
 * Expose Shark clients
 */
const Shark = require('./src/shark')

Shark.ServiceTokenClient = require('./src/service-token/server')

module.exports = Shark
