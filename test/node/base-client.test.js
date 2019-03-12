/* eslint-env jest */
'use strict'

const nock = require('nock')

const {
  BODY,
  SERVICE_TOKEN_RESPONSE_BODY,
  CLIENT_URL,
  DOORKEEPER_BASE_URL,
  JWT,
  teardown
} = require('./test-helper')

const proxy = require('../../src/proxy')
proxy.ServiceTokenClient = require('../../src/node/service-token')

const Client = require('../../src/clients/base-client')

const client = new Client({
  name: 'ServerClient',
  url: CLIENT_URL,
  contentType: 'application/vnd.api+json',
  accessKey: 'doorkeeper_client_access_key',
  secretKey: '0123456789',
  doorkeeperBaseUrl: DOORKEEPER_BASE_URL
})

function mockServiceTokenFetchSuccess (options) {
  const {
    host,
    path,
    method,
    responseBody
  } = options

  nock(host)
    .matchHeader('Authorization', /^APIAuth-HMAC-SHA1 doorkeeper_client_access_key:/)
    .intercept(path, method)
    .reply(200, responseBody)
}

function mockFetch (options) {
  const {
    method,
    host,
    path,
    responseBody,
    status
  } = options

  nock(host)
    .matchHeader('Authorization', `Bearer ${JWT}`)
    .intercept(path || '/', method || 'GET')
    .reply(status || 200, responseBody)
  nock(host)
    .intercept(path || '', method || 'GET')
    .reply(403, { message: 'Access forbidden' })
}

describe('Node version: BaseClient with successful service token', () => {
  beforeEach(() => {
    mockServiceTokenFetchSuccess({
      method: 'POST',
      host: DOORKEEPER_BASE_URL,
      path: '/api/tokens/service_token',
      responseBody: SERVICE_TOKEN_RESPONSE_BODY
    })
  })
  afterEach(() => {
    teardown()
  })

  describe('#baseUrl', () => {
    it('should be a valid url', () => {
      expect(client.baseUrl).toEqual(CLIENT_URL)
    })
  })

  describe('#config', () => {
    it('should have a contentType', () => {
      expect(client.contentType).toEqual('application/vnd.api+json')
    })
  })

  describe('#search', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          host: CLIENT_URL,
          path: '/?include=contacts',
          responseBody: [BODY, BODY]
        })
      })

      it('should return json', (done) => {
        const promise = client.search({ include: 'contacts' })
        promise.then(json => {
          expect(json).toEqual([BODY, BODY])
          done()
        })
      })
    })
  })

  describe('#find', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          host: CLIENT_URL,
          path: '/1',
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          expect(body).toEqual(BODY)
          done()
        })
      })
    })

    describe('on access forbidden', () => {
      beforeEach(() => {
        mockFetch({
          host: CLIENT_URL,
          path: '/1',
          responseBody: { message: 'Access forbidden' },
          status: 403
        })
      })

      it('should reject with a ClientError', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          done(new Error('client#find() was resolved, but it should fail!'))
        }, error => {
          expect(Array.isArray(error.errors)).toEqual(true)
          expect(error.errors[0].status).toEqual(403)
          expect(error.errors[0].detail).toEqual('Access forbidden')
          done()
        })
      })
    })

    describe('on not found', () => {
      beforeEach(() => {
        mockFetch({
          host: CLIENT_URL,
          path: '/1',
          responseBody: { message: 'Object not found' },
          status: 404
        })
      })

      it('should reject with a ClientError', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          done(new Error('client#find() was resolved, but it should fail!'))
        }, error => {
          expect(Array.isArray(error.errors)).toEqual(true)
          expect(error.errors[0].status).toEqual(404)
          expect(error.errors[0].detail).toEqual('Object not found')
          done()
        })
      })
    })
  })

  describe('#create', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'POST',
          host: CLIENT_URL,
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.create(BODY)
        promise.then(body => {
          expect(body).toEqual(BODY)
          done()
        })
      })
    })
  })

  describe('#update', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'PUT',
          host: CLIENT_URL,
          path: '/1',
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.update(1, BODY)
        promise.then(body => {
          expect(body).toEqual(BODY)
          done()
        })
      })
    })
  })

  describe('#destroy', () => {
    describe('on success 200 with body', () => {
      beforeEach(() => {
        mockFetch({
          method: 'DELETE',
          host: CLIENT_URL,
          path: '/1',
          responseBody: { message: 'Object deleted' }
        })
      })

      it('should return json', (done) => {
        const promise = client.destroy(1)
        promise.then(body => {
          expect(body).toEqual({ message: 'Object deleted' })
          done()
        })
      })
    })

    describe('on success 204 without body', () => {
      beforeEach(() => {
        mockFetch({
          method: 'DELETE',
          host: CLIENT_URL,
          path: '/1',
          responseBody: null,
          status: 204
        })
      })

      it('should return empty json', (done) => {
        const promise = client.destroy(1)
        promise.then(body => {
          expect(body).toEqual({})
          done()
        })
      })
    })
  })
})
