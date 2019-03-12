/* eslint-env jest */
'use strict'

const URL = require('url')
const nock = require('nock')
const nodeFetch = require('node-fetch')

const Config = require('../../src/config')
const proxy = require('../../src/proxy')

proxy.fetch = nodeFetch
proxy.Headers = nodeFetch.Headers
proxy.Request = nodeFetch.Request
proxy.Response = nodeFetch.Response
proxy.ServiceTokenClient = require('../../src/browser/service-token')

/**
 * Fake window.fetch in a browser environment
 */
window.fetch = nodeFetch
window.Headers = nodeFetch.Headers
window.Request = nodeFetch.Request
window.Response = nodeFetch.Response

Object.assign(Config, {
  debug: false,
  serviceTokenUrl: 'https://myapp.example.org/doorkeeper/service_token'
})

/*
 * API request mocks
 */
const BODY = {
  foo: 1,
  bar: '12345',
  baz: ['hello', 'world', '!']
}
const CLIENT_URL = 'https://client.example.org/'
const JWT = 'json-web-token-0123456789'
const SERVICE_TOKEN_URL = Config.serviceTokenUrl

function setupTokenSuccess () {
  const url = URL.parse(SERVICE_TOKEN_URL)
  nock(`${url.protocol}//${url.host}`)
    .post(URL.parse(SERVICE_TOKEN_URL).path)
    .reply(200, {
      data: {
        attributes: {
          jwt: JWT,
          expires_at: new Date()
        }
      }
    })
}

function setupTokenError () {
  const url = URL.parse(SERVICE_TOKEN_URL)
  nock(`${url.protocol}//${url.host}`)
    .post(URL.parse(SERVICE_TOKEN_URL).path)
    .reply(500, 'internal server error')
}

function teardown () {
  nock.cleanAll()
}

module.exports = {
  BODY,
  CLIENT_URL,
  JWT,
  setupTokenSuccess,
  setupTokenError,
  teardown
}
