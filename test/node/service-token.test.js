/* eslint-env jest */
'use strict'

const nock = require('nock')

const {
  DOORKEEPER_BASE_URL,
  SERVICE_TOKEN_RESPONSE_BODY,
  USER_RESPONSE_BODY,
  JWT
} = require('./test-helper')

const ServiceToken = require('../../src/node/service-token')

const userId = 'doorkeeper-user-id'
const serviceToken = 'doorkeeper-service-token'

const client = new ServiceToken({
  accessKey: 'doorkeeper_client_access_key',
  secretKey: '0123456789',
  baseUrl: DOORKEEPER_BASE_URL
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
    .matchHeader('Authorization', /^APIAuth-HMAC-SHA1 doorkeeper_client_access_key:/)
    .intercept(path || '/', method || 'GET')
    .reply(status || 200, responseBody)
  nock(host)
    .intercept(path || '', method || 'GET')
    .reply(401, { message: 'Access forbidden' })
}

describe('ServiceToken', () => {
  describe('#baseUrl', () => {
    it('should be a valid url', () => {
      expect(client.baseUrl).toEqual(DOORKEEPER_BASE_URL)
    })
  })

  describe('#createServiceToken', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'POST',
          host: DOORKEEPER_BASE_URL,
          path: '/api/tokens/service_token',
          responseBody: SERVICE_TOKEN_RESPONSE_BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.createServiceToken({ userId: userId })
        promise.then(body => {
          expect(body.jwt).toEqual(JWT)
          done()
        })
      })
    })
  })

  describe('#verifyServiceToken', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          host: DOORKEEPER_BASE_URL,
          path: `/api/users/authenticate?include=permission&service_token=${serviceToken}`,
          responseBody: USER_RESPONSE_BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.verifyServiceToken({ serviceToken: serviceToken, include: 'permission' })
        promise.then(body => {
          expect(body.id).toEqual(USER_RESPONSE_BODY.data.id)
          expect(body.firstName).toEqual(USER_RESPONSE_BODY.data.attributes.first_name)
          expect(body.lastName).toEqual(USER_RESPONSE_BODY.data.attributes.last_name)
          done()
        })
      })
    })
  })
})
