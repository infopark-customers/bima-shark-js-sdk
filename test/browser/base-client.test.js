/* eslint-env jest */
'use strict'

const nock = require('nock')

const {
  BODY,
  CLIENT_URL,
  JWT,
  setupTokenSuccess,
  setupTokenError,
  teardown
} = require('./test-helper')

const Client = require('../../src/clients/base-client')

const client = new Client({
  name: 'BrowserClient',
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

describe('Browser version: BaseClient with successful service token', () => {
  beforeEach(() => {
    setupTokenSuccess()
  })
  afterEach(() => {
    teardown()
  })

  describe('#baseUrl', () => {
    it('should be a valid url', () => {
      expect(client.baseUrl).toEqual(CLIENT_URL)
    })
  })

  describe('#search', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          host: CLIENT_URL,
          path: '/?filter%5B%5D=b&filter%5B%5D%5Bc%5D%5B%5D=d&filter%5B%5D%5Bc%5D%5B%5D=f&include=contacts',
          responseBody: [BODY, BODY]
        })
      })

      it('should return json', (done) => {
        const promise = client.search(
          {
            filter: [
              'b',
              { c: ['d', 'f'] }
            ],
            include: 'contacts'
          }
        )
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

      it('should return empty body', (done) => {
        const promise = client.destroy(1)
        promise.then(body => {
          expect(body).toEqual('')
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
          expect(body).toEqual({ message: 'Object deleted' })
          done()
        }, error => {
          expect(Array.isArray(error.errors)).toEqual(true)
          expect(error.errors[0].status).toEqual(503)
          done(new Error('client#destroy() failed, but it should resolve!'))
        })
      })
    })
  })

  describe('#get', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          host: CLIENT_URL,
          path: '/foobar?query=yolo',
          responseBody: [BODY, BODY]
        })
      })

      it('should return json', (done) => {
        const promise = client.get('foobar', { query: 'yolo' })
        promise.then(json => {
          expect(json).toEqual([BODY, BODY])
          done()
        })
      })
    })
  })

  describe('#post', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'POST',
          host: CLIENT_URL,
          path: '/foobar',
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.post('/foobar', BODY)
        promise.then(body => {
          expect(body).toEqual(BODY)
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
          path: '/foo?include=contacts',
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.patch('foo', BODY, { include: 'contacts' })
        promise.then(body => {
          expect(body).toEqual(BODY)
          done()
        })
      })
    })
  })

  describe('#put', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'PUT',
          host: CLIENT_URL,
          path: '/foobar',
          responseBody: BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.put('foobar', BODY)
        promise.then(body => {
          expect(body).toEqual(BODY)
          done()
        })
      })
    })
  })

  describe('#delete', () => {
    describe('on success 200 with body', () => {
      beforeEach(() => {
        mockFetch({
          method: 'DELETE',
          host: CLIENT_URL,
          path: '/foobar',
          responseBody: { message: 'Object deleted' }
        })
      })

      it('should return json', (done) => {
        const promise = client.delete('foobar')
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
          path: '/foobar',
          responseBody: null,
          status: 204
        })
      })

      it('should return empty body', (done) => {
        const promise = client.delete('foobar')
        promise.then(body => {
          expect(body).toEqual('')
          done()
        })
      })
    })
  })
})

describe('Browser version: BaseClient with failed service tokens', () => {
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
          expect(Array.isArray(error.errors)).toEqual(true)
          expect(error.errors[0].status).toEqual(500)
          expect(error.errors[0].detail).toEqual('Unhandled error')
          done()
        })
      })
    })
  })
})

describe('Browser version: BaseClient without authentication', () => {
  describe('#find', () => {
    describe('on success', () => {
      test.todo('cannot be tested with node-fetch')
    })
  })
})
