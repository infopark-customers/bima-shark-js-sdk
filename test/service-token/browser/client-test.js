/* eslint-env mocha */
'use strict'

const { expect } = require('chai')

const {
  JWT,
  setupTokenSuccess,
  setupTokenError,
  teardown
} = require('../../test-helper')

const ServiceToken = require('../../../src/service-token/browser/client')

const client = new ServiceToken()

context('In Browser environments', () => {
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
        expect(promise instanceof Promise).to.eql(true)
      })

      it('should create a Promise that resolves to a token with jwt', (done) => {
        const promise = client.createServiceToken()
        promise.then(token => {
          expect(token.jwt).to.eql(JWT)
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
          expect(Array.isArray(error.errors)).to.eql(true)
          expect(error.errors[0].status).to.eql(500)
          expect(error.errors[0].detail).to.eql('internal server error')
          done()
        })
      })
    })
  })
})
