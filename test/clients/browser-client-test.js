/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const nock = require('nock')

const {
  BODY,
  CLIENT_URL,
  JWT,
  setupTokenSuccess,
  setupTokenError,
  teardown
} = require('../test-helper')

const sharkServiceToken = require('../../src/utils/shark-service-token')
const ServiceTokenClient = require('../../src/service-token/browser/client')

Object.assign(sharkServiceToken, {
  ServiceTokenClient: ServiceTokenClient
})

const Client = require('../../src/clients/base-client')

const client = new Client({
  name: 'TestClient',
  url: CLIENT_URL,
  contentType: 'application/vnd.api+json'
})

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

describe('Client with successful service token', () => {
  beforeEach(() => {
    setupTokenSuccess()
  })
  afterEach(() => {
    teardown()
  })

  describe('#baseUrl', () => {
    it('should be a valid url', () => {
      expect(client.baseUrl).to.eql(CLIENT_URL)
    })
  })

  describe('#config', () => {
    it('should have a contentType', () => {
      expect(client.config.contentType).to.eql('application/vnd.api+json')
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
          expect(json).to.eql([BODY, BODY])
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
          expect(body).to.eql(BODY)
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
          expect(Array.isArray(error.errors)).to.eql(true)
          expect(error.errors[0].status).to.eql(403)
          expect(error.errors[0].detail).to.eql('Access forbidden')
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
          expect(Array.isArray(error.errors)).to.eql(true)
          expect(error.errors[0].status).to.eql(404)
          expect(error.errors[0].detail).to.eql('Object not found')
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
          expect(body).to.eql(BODY)
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
          expect(body).to.eql(BODY)
          done()
        })
      })
    })
  })

  describe('#patch', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'PATCH',
          host: CLIENT_URL,
          path: '/1?include=contacts',
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.patch(1, BODY, { include: 'contacts' })
        promise.then(body => {
          expect(body).to.eql(BODY)
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
          expect(body).to.eql({ message: 'Object deleted' })
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
          expect(body).to.eql({})
          done()
        })
      })
    })

    describe('on success 204 with body', () => {
      beforeEach(() => {
        mockFetch({
          method: 'DELETE',
          host: CLIENT_URL,
          path: '/1',
          responseBody: { message: 'Object deleted' },
          status: 204
        })
      })

      // in browser fetch throws TypeError
      // in node.js it works
      it('should not reject with a TypeError', (done) => {
        const promise = client.destroy(1)
        promise.then(body => {
          expect(body).to.eql({ message: 'Object deleted' })
          done()
        }, error => {
          expect(Array.isArray(error.errors)).to.eql(true)
          expect(error.errors[0].status).to.eql(503)
          done(new Error('client#destroy() failed, but it should resolve!'))
        })
      })
    })
  })

  describe('#uploadFile', () => {
    describe('on success 204 without body', () => {
      beforeEach(() => {
        mockFetch({
          method: 'POST',
          host: CLIENT_URL,
          path: '/1/file',
          responseBody: null,
          status: 204
        })
      })

      it('should return empty body', (done) => {
        const formData = new window.FormData()
        formData.append('file', new window.File([''], 'filename', { type: 'text/html' }))
        const promise = client.uploadFile('1/file', formData)
        promise.then(body => {
          expect(body).to.eql({})
          done()
        })
      })
    })
  })
})

describe('Client with failed service tokens', () => {
  beforeEach(() => {
    setupTokenError()
  })
  afterEach(() => {
    teardown()
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

      it('should reject with JSONAPI error object', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          done.fail('client#find() was resolved, but it should fail!')
        }, error => {
          expect(Array.isArray(error.errors)).to.eql(true)
          expect(error.errors[0].status).to.eql(500)
          expect(error.errors[0].detail).to.eql('internal server error')
          done()
        })
      })
    })
  })
})

describe('Client without authentication', () => {
  describe('#find', () => {
    describe('on success', () => {
      it('cannot be tested with node-fetch')
    })
  })
})
