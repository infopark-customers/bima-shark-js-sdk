/* eslint-env mocha */
'use strict'

const nock = require('nock')

function mockServiceTokenFetch (options) {
  const {
    method,
    host,
    path,
    responseBody,
    status
  } = options

  nock(host)
    .matchHeader('Authorization', /^APIAuth-HMAC-SHA1 doorkeeper_client_access_key:/)
    .intercept(path || '/', method || 'GET')
    .reply(status || 200, responseBody)
}

module.exports = {
  mockServiceTokenFetch
}
