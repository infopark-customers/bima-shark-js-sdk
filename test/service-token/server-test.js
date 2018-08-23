/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const nock = require('nock')

const {
  SERVICE_TOKEN_RESPONSE_BODY
} = require('../test-helper')

const ServiceToken = require('../../src/service-token/server')

const baseUrl = 'https://doorkeeper.example.org'
const userId = 'doorkeeper-user-id'
const serviceToken = 'doorkeeper-service-token'

const client = new ServiceToken({
  accessKey: 'doorkeeper_client_access_key',
  secretKey: '0123456789',
  baseUrl: baseUrl
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
      expect(client.baseUrl).to.eql(baseUrl)
    })
  })

  describe('#createServiceToken', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          method: 'POST',
          host: baseUrl,
          path: '/api/tokens/service_token',
          responseBody: SERVICE_TOKEN_RESPONSE_BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.createServiceToken({ userId: userId })
        promise.then(body => {
          expect(body.id).to.eql(SERVICE_TOKEN_RESPONSE_BODY.data.id)
          expect(body.firstName).to.eql(SERVICE_TOKEN_RESPONSE_BODY.data.attributes.first_name)
          expect(body.lastName).to.eql(SERVICE_TOKEN_RESPONSE_BODY.data.attributes.last_name)
          done()
        })
      })
    })
  })

  describe('#verifyServiceToken', () => {
    describe('on success', () => {
      beforeEach(() => {
        mockFetch({
          host: baseUrl,
          path: `/api/users/authenticate?include=permission&service_token=${serviceToken}`,
          responseBody: SERVICE_TOKEN_RESPONSE_BODY
        })
      })

      it('should return json', (done) => {
        const promise = client.verifyServiceToken({ serviceToken: serviceToken, include: 'permission' })
        promise.then(body => {
          expect(body.id).to.eql(SERVICE_TOKEN_RESPONSE_BODY.data.id)
          expect(body.firstName).to.eql(SERVICE_TOKEN_RESPONSE_BODY.data.attributes.first_name)
          expect(body.lastName).to.eql(SERVICE_TOKEN_RESPONSE_BODY.data.attributes.last_name)
          done()
        })
      })
    })
  })
})
