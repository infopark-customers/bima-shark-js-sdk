'use strict'

const [major,,] = process.versions.node.split('.').map(Number)

if (major < 18) {
  console.error('[Shark] NodeJS >= 18 is required for native fetch')
}

/*
 * Configure proxy with Node.js implementation details
 */
const proxy = require('./src/proxy')

proxy.uploadFile = require('./src/node/upload-file')
proxy.ServiceTokenClient = require('./src/node/service-token')

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
Shark.ServiceTokenClient = proxy.ServiceTokenClient

module.exports = Shark
