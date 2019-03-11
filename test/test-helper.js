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
const DOORKEEPER_BASE_URL = 'https://doorkeeper.example.org'
const JWT = 'json-web-token-0123456789'
const SERVICE_TOKEN_URL = Config.serviceTokenUrl
const DOORKEEPER_SERVICE_TOKEN_URL = '/api/tokens/service_token'

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
      'first_name': 'Roger',
      'last_name': 'Rabbit'
    }
  }
}

function mockServiceTokenClientSuccessFetch () {
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

function mockServiceTokenClientErrorFetch () {
  const url = URL.parse(SERVICE_TOKEN_URL)
  nock(`${url.protocol}//${url.host}`)
    .post(URL.parse(SERVICE_TOKEN_URL).path)
    .reply(500, 'internal server error')
}

function mockServiceTokenDoorkeeperFetch (options) {
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

function teardown () {
  nock.cleanAll()
}

module.exports = {
  BODY,
  CLIENT_URL,
  DOORKEEPER_BASE_URL,
  JWT,
  SERVICE_TOKEN_URL,
  DOORKEEPER_SERVICE_TOKEN_URL,
  USER_RESPONSE_BODY,
  SERVICE_TOKEN_RESPONSE_BODY,
  mockServiceTokenClientSuccessFetch,
  mockServiceTokenClientErrorFetch,
  mockServiceTokenDoorkeeperFetch,
  teardown
}
