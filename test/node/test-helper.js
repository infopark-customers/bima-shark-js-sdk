/* eslint-env jest */
'use strict'

const nodeFetch = require('node-fetch')

const SharkProxy = require('../../src/proxy')

SharkProxy.fetch = nodeFetch
SharkProxy.Headers = nodeFetch.Headers
SharkProxy.Request = nodeFetch.Request
SharkProxy.Response = nodeFetch.Response
SharkProxy.ServiceTokenClient = require('../../src/node/service-token')

/*
 * API request mocks
 */
const BODY = {
  foo: 1,
  bar: '12345',
  baz: ['hello', 'world', '!']
}
const CLIENT_URL = 'https://client.example.org/'
const DOORKEEPER_BASE_URL = 'https://doorkeeper.example.org'
const JWT = 'json-web-token-0123456789'

const SERVICE_TOKEN_RESPONSE_BODY = {
  data: {
    attributes: {
      jwt: JWT,
      expires_at: new Date()
    }
  }
}

const USER_RESPONSE_BODY = {
  data: {
    type: 'users',
    id: '5490143e69e49d0c8f9fc6bc',
    attributes: {
      first_name: 'Roger',
      last_name: 'Rabbit'
    }
  }
}

module.exports = {
  BODY,
  CLIENT_URL,
  DOORKEEPER_BASE_URL,
  JWT,
  USER_RESPONSE_BODY,
  SERVICE_TOKEN_RESPONSE_BODY
}
