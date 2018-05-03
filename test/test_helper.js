/* eslint-env jasmine */
'use strict'

import fetchMock from 'fetch-mock'
import Shark from 'src/index'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000

export const TEST = {
  BODY: { foo: 1, bar: '12345', baz: ['hello', 'world', '!'] },
  CLIENT_URL: 'https://client.example.org/',
  JWT: 'json-web-token-0123456789',
  SERVICE_TOKEN_URL: 'https://myapp.example.org/doorkeeper/service_token'
}

/*
 * Setup test config
 */
Shark.configure({
  debug: false,
  serviceTokenUrl: TEST.SERVICE_TOKEN_URL
})

/*
 * API request mocks
 */
export const setup = {
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

export function teardown () {
  afterEach(() => {
    fetchMock.restore()
  })
}

export default {
  setup,
  teardown,
  TEST
}
