/* eslint-env jest */
'use strict'

const {
  JWT,
  setupTokenSuccess,
  setupTokenError,
  teardown
} = require('./test-helper')

const Config = require('../../src/config')
const ServiceToken = require('../../src/browser/service-token')

const client = new ServiceToken({
  baseUrl: Config.serviceTokenUrl
})

describe('ServiceToken#createServiceToken', () => {
  afterEach(() => {
    teardown()
  })

  describe('on success', () => {
    beforeEach(() => {
      setupTokenSuccess()
    })

    it('should create a Promise', () => {
      const promise = client.createServiceToken()
      expect(promise instanceof Promise).toEqual(true)
    })

    it('should create a Promise that resolves to a token with jwt', (done) => {
      const promise = client.createServiceToken()
      promise.then(token => {
        expect(token.jwt).toEqual(JWT)
        done()
      })
    })
  })

  describe('on failure', () => {
    beforeEach(() => {
      setupTokenError()
    })

    it('should create a Promise that is rejected', (done) => {
      const promise = client.createServiceToken()
      promise.then(token => {
        done(new Error('ServiceToken.create() was resolved, but it should fail!'))
      }, error => {
        expect(Array.isArray(error.errors)).toEqual(true)
        expect(error.errors[0].status).toEqual(500)
        expect(error.errors[0].detail).toEqual('internal server error')
        done()
      })
    })
  })
})
