/* eslint-env jest */
'use strict'

const nock = require('nock')

const {
  DOORKEEPER_BASE_URL,
  SERVICE_TOKEN_RESPONSE_BODY,
  USER_RESPONSE_BODY,
  JWT
} = require('./test-helper')

const Cache = require('../../src/cache')
const ServiceToken = require('../../src/node/service-token')

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
  afterEach(() => {
    Cache.empty()
    nock.cleanAll()
  })

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

      describe('with userId', () => {
        const userId = 'doorkeeper-user-id'
        const client = new ServiceToken({
          accessKey: 'doorkeeper_client_access_key',
          secretKey: '0123456789',
          baseUrl: DOORKEEPER_BASE_URL,
          userId: userId
        })

        it('should return json', (done) => {
          const promise = client.createServiceToken()
          promise.then(body => {
            expect(body.jwt).toEqual(JWT)
            done()
          })
        })

        it('should cache the token', (done) => {
          const promise = client.createServiceToken()
          promise.then(body => {
            expect(Cache.data).toHaveProperty(`api-service-token/${userId}`)
            expect(Cache.data).toHaveProperty(`api-service-token/${userId}.jwt`, JWT)
            done()
          })
        })
      })

      describe('without userId', () => {
        it('should return json', (done) => {
          const promise = client.createServiceToken()
          promise.then(body => {
            expect(body.jwt).toEqual(JWT)
            done()
          })
        })

        it('should cache the token', (done) => {
          const promise = client.createServiceToken()
          promise.then(body => {
            expect(Cache.data).toHaveProperty(`api-service-token/undefined`)
            expect(Cache.data).toHaveProperty(`api-service-token/undefined.jwt`, JWT)
            done()
          })
        })
      })
    })
  })

  describe('#verifyServiceToken', () => {
    const serviceToken = 'doorkeeper-service-token'

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
