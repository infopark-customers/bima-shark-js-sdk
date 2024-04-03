'use strict'

if (!window.fetch) {
  console.error('[Shark] No implementation of window.fetch found.')
  console.error('[Shark] Please add a polyfill like `whatwg-fetch`.')
}

/*
 * Configure proxy with browser environment implementation details
 */
const proxy = require('./src/proxy')

proxy.uploadFile = require('./src/browser/upload-file')
proxy.ServiceTokenClient = require('./src/browser/service-token')

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
Shark.ServiceTokenClient = proxy.ServiceTokenClient

module.exports = Shark
