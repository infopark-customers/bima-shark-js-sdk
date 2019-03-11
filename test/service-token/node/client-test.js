/* eslint-env mocha */
'use strict'

const { expect } = require('chai')

const {
  DOORKEEPER_BASE_URL,
  SERVICE_TOKEN_RESPONSE_BODY,
  JWT,
  mockServiceTokenDoorkeeperFetch
} = require('../../test-helper')

const ServiceTokenClient = require('../../../src/service-token/node/client')

const client = new ServiceTokenClient({
  accessKey: 'doorkeeper_client_access_key',
  secretKey: '0123456789',
  doorkeeperUrl: DOORKEEPER_BASE_URL
})

context('In Node.js environment', () => {
  describe('ServiceTokenClient', () => {
    describe('#doorkeeperUrl', () => {
      it('should be a valid url', () => {
        expect(client.doorkeeperUrl).to.eql(DOORKEEPER_BASE_URL)
      })
    })

    describe('#createServiceToken', () => {
      describe('on success', () => {
        beforeEach(() => {
          mockServiceTokenDoorkeeperFetch({
            method: 'POST',
            host: DOORKEEPER_BASE_URL,
            path: '/api/tokens/service_token',
            responseBody: SERVICE_TOKEN_RESPONSE_BODY
          })
        })

        it('should return json', (done) => {
          const promise = client.createServiceToken()
          promise.then(body => {
            expect(body.jwt).to.eql(JWT)
            done()
          })
        })
      })
    })
  })
})
