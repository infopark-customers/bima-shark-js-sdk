/* eslint-env mocha */
'use strict'

const URL = require('url')
const jsdom = require('jsdom-global')
const nock = require('nock')

const Config = require('../src/config')
const sharkFetch = require('../src/utils/shark-fetch')
const nodeFetch = require('node-fetch')
Object.assign(sharkFetch, {
  fetch: nodeFetch,
  Headers: nodeFetch.Headers,
  Request: nodeFetch.Request,
  Response: nodeFetch.Response
})

Object.assign(Config, {
  debug: false,
  serviceTokenUrl: 'https://myapp.example.org/doorkeeper/service_token'
})

before(() => { jsdom() })
after(() => { jsdom() })

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

function setupTokenSuccess () {
  const url = URL.parse(SERVICE_TOKEN_URL)
  nock(`${url.protocol}//${url.host}`)
    .post(URL.parse(SERVICE_TOKEN_URL).path)
    .reply(200, {
      attributes: {
        jwt: JWT,
        expires_at: new Date()
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
  SERVICE_TOKEN_URL,
  SERVICE_TOKEN_RESPONSE_BODY,
  setupTokenSuccess,
  setupTokenError,
  teardown
}