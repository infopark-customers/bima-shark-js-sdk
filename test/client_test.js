/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const fetchMock = require('fetch-mock')
const { setup, teardown, TEST } = require('./test_helper')
const Client = require('../src/shark/client')

const client = new Client({
  name: 'TestClient',
  url: TEST.CLIENT_URL,
  contentType: 'application/vnd.api+json'
})

function mockBody (body, status = 200) {
  return function (url, options) {
    if (options.headers['Authorization'] === `Bearer ${TEST.JWT}`) {
      return {
        body: body || options.body,
        status: status
      }
    } else {
      return {
        body: { message: 'Access forbidden' },
        status: 403
      }
    }
  }
}

/**
 * Use 'done()' for asynchronous Jasmine testing.
 * https://jasmine.github.io/tutorials/async
 */
describe('Client with successful service token', () => {
  setup.serviceTokenSuccess()
  teardown()

  describe('#baseUrl', () => {
    it('should be a valid url', () => {
      expect(client.baseUrl).to.eql(TEST.CLIENT_URL)
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
        fetchMock.get(TEST.CLIENT_URL + '?include=contacts',
          mockBody([TEST.BODY, TEST.BODY])
        )
      })

      it('should return json', (done) => {
        const promise = client.search({ include: 'contacts' })
        promise.then(json => {
          expect(json).to.eql([TEST.BODY, TEST.BODY])
          done()
        })
      })
    })
  })

  describe('#find', () => {
    describe('on success', () => {
      beforeEach(() => {
        fetchMock.get(TEST.CLIENT_URL + '1',
          mockBody(TEST.BODY)
        )
      })

      it('should return json', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          expect(body).to.eql(TEST.BODY)
          done()
        })
      })
    })

    describe('on access forbidden', () => {
      beforeEach(() => {
        fetchMock.get(TEST.CLIENT_URL + '1',
          mockBody({ message: 'Access forbidden' }, 403)
        )
      })

      it('should reject with a ClientError', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          done.fail('client#find() was resolved, but it should fail!')
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
        fetchMock.get(TEST.CLIENT_URL + '1',
          mockBody({ message: 'Object not found' }, 404)
        )
      })

      it('should reject with a ClientError', (done) => {
        const promise = client.find(1)
        promise.then(body => {
          done.fail('client#find() was resolved, but it should fail!')
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
        fetchMock.post(TEST.CLIENT_URL,
          mockBody(TEST.BODY)
        )
      })

      it('should return json', (done) => {
        const promise = client.create(TEST.BODY)
        promise.then(body => {
          expect(body).to.eql(TEST.BODY)
          done()
        })
      })
    })
  })

  describe('#update', () => {
    describe('on success', () => {
      beforeEach(() => {
        fetchMock.put(TEST.CLIENT_URL + '1',
          mockBody(TEST.BODY)
        )
      })

      it('should return json', (done) => {
        const promise = client.update(1, TEST.BODY)
        promise.then(body => {
          expect(body).to.eql(TEST.BODY)
          done()
        })
      })
    })
  })

  describe('#destroy', () => {
    describe('on success 200 with body', () => {
      beforeEach(() => {
        fetchMock.delete(TEST.CLIENT_URL + '1',
          mockBody({ message: 'Object deleted' }, 200)
        )
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
        fetchMock.delete(TEST.CLIENT_URL + '1',
          mockBody(null, 204)
        )
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
        fetchMock.delete(TEST.CLIENT_URL + '1',
          mockBody({ message: 'Object deleted' }, 204)
        )
      })

      it('should reject with a TypeError', (done) => {
        const promise = client.destroy(1)
        promise.then(body => {
          done.fail('client#find() was resolved, but it should fail!')
        }, error => {
          expect(Array.isArray(error.errors)).to.eql(true)
          expect(error.errors[0].status).to.eql(503)
          done()
        })
      })
    })
  })
})

describe('Client with failed service tokens', () => {
  setup.serviceTokenError()
  teardown()

  describe('#find', () => {
    describe('on success', () => {
      beforeEach(() => {
        fetchMock.get(TEST.CLIENT_URL + '1',
          mockBody(TEST.BODY)
        )
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

const internalClient = new Client({
  name: 'TestClientWithoutAuthenticationHeader',
  url: '/'
})

describe('Client without authentication', () => {
  teardown()

  describe('#find', () => {
    describe('on success', () => {
      beforeEach(() => {
        fetchMock.get('/1', {
          body: TEST.BODY,
          status: 200
        })
      })

      it('should return json', (done) => {
        const promise = internalClient.find(1)
        promise.then(body => {
          expect(body).to.eql(TEST.BODY)
          done()
        })
      })
    })
  })
})
