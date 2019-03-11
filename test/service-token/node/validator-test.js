/* eslint-env mocha */
'use strict'

const { expect } = require('chai')

const {
  DOORKEEPER_BASE_URL,
  USER_RESPONSE_BODY,
  mockServiceTokenDoorkeeperFetch
} = require('../../test-helper')

const ServiceTokenValidator = require('../../../src/service-token/node/validator')

const serviceToken = 'doorkeeper-service-token'

const client = new ServiceTokenValidator({
  accessKey: 'doorkeeper_client_access_key',
  secretKey: '0123456789',
  doorkeeperUrl: DOORKEEPER_BASE_URL
})

context('In Node.js environment', () => {
  describe('ServiceTokenValidator', () => {
    describe('#doorkeeperUrl', () => {
      it('should be a valid url', () => {
        expect(client.doorkeeperUrl).to.eql(DOORKEEPER_BASE_URL)
      })
    })

    describe('#verifyServiceToken', () => {
      describe('on success', () => {
        beforeEach(() => {
          mockServiceTokenDoorkeeperFetch({
            host: DOORKEEPER_BASE_URL,
            path: `/api/users/authenticate?include=permission&service_token=${serviceToken}`,
            responseBody: USER_RESPONSE_BODY
          })
        })

        it('should return json', (done) => {
          const promise = client.verifyServiceToken({ serviceToken: serviceToken, include: 'permission' })
          promise.then(body => {
            expect(body.id).to.eql(USER_RESPONSE_BODY.data.id)
            expect(body.firstName).to.eql(USER_RESPONSE_BODY.data.attributes.first_name)
            expect(body.lastName).to.eql(USER_RESPONSE_BODY.data.attributes.last_name)
            done()
          })
        })
      })
    })
  })
})
