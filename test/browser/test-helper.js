/* eslint-env jest */
'use strict'

const url = require('url')
const nock = require('nock')
const nodeFetch = require('node-fetch')

const Config = require('../../src/config')
const SharkProxy = require('../../src/proxy')

SharkProxy.fetch = nodeFetch
SharkProxy.Headers = nodeFetch.Headers
SharkProxy.Request = nodeFetch.Request
SharkProxy.Response = nodeFetch.Response
SharkProxy.ServiceTokenClient = require('../../src/browser/service-token')

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
  const serviceTokenUrl = new url.URL(SERVICE_TOKEN_URL)
  nock(serviceTokenUrl.origin)
    .post(serviceTokenUrl.pathname)
    .reply(200, {
      data: {
        attributes: {
          jwt: JWT,
          expires_at: new Date()
        }
      }
    }, {
      'content-type': 'application/vnd.api+json'
    })
}

function setupTokenError () {
  const serviceTokenUrl = new url.URL(SERVICE_TOKEN_URL)
  nock(serviceTokenUrl.origin)
    .post(serviceTokenUrl.pathname)
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
