'use strict'

// TODO https://github.com/qubyte/fetch-ponyfill/blob/master/fetch-node.js

/*
 * Configure shark-fetch with Node.js implementation
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
 * Configure shark-upload-file with Node.js implementation
 */
const uploadFileNode = require('./src/utils/upload-file-node')
const sharkUploadFile = require('./src/utils/shark-upload-file')
Object.assign(sharkUploadFile, {
  uploadFile: uploadFileNode
})

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
const { isArray, isFunction, isObject, isString } = require('./src/utils/typecheck')

Shark.ServiceTokenClient = require('./src/service-token/server')
Shark.MailingClient = require('./src/clients/mailing-client')

Shark.fetch = require('./src/utils/simple-fetch')
Shark.isArray = isArray
Shark.isFunction = isFunction
Shark.isObject = isObject
Shark.isString = isString

module.exports = Shark
