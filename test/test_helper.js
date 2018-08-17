/* eslint-env mocha */
'use strict'

const fetchMock = require('fetch-mock')
const Shark = require('../src/index')

Shark.configure({
  debug: false,
  serviceTokenUrl: 'https://myapp.example.org/doorkeeper/service_token'
})

/*
 * API request mocks
 */
const TEST = {
  BODY: { foo: 1, bar: '12345', baz: ['hello', 'world', '!'] },
  CLIENT_URL: 'https://client.example.org/',
  JWT: 'json-web-token-0123456789',
  SERVICE_TOKEN_URL: Shark.config.serviceTokenUrl
}

const SERVICE_TOKEN_RESPONSE_BODY = {
  data: {
    type: 'users',
    id: '5490143e69e49d0c8f9fc6bc',
    attributes: {
      'first_name': 'Roger',
      'last_name': 'Rabbit'
    }
  }
}
const setup = {
  serviceTokenSuccess: () => {
    beforeEach(() => {
      fetchMock.post(TEST.SERVICE_TOKEN_URL, {
        body: {
          attributes: {
            jwt: TEST.JWT,
            expires_at: new Date()
          }
        },
        status: 200
      })
    })
  },
  serviceTokenError: () => {
    beforeEach(() => {
      fetchMock.post(TEST.SERVICE_TOKEN_URL, {
        body: 'internal server error',
        status: 500
      })
    })
  }
}

function teardown () {
  afterEach(() => {
    fetchMock.restore()
  })
}

module.exports = {
  SERVICE_TOKEN_RESPONSE_BODY,
  TEST,
  setup,
  teardown
}
