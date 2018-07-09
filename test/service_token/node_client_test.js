/* eslint-env mocha */
/* global expect */
'use strict'

import fetchMock from 'fetch-mock'
import ServiceTokenClient from 'src/shark/service_token/node_client.js'

const baseUrl = 'https://doorkeeper.example.org'
const userId = 'doorkeeper-user-id'
const serviceToken = 'doorkeeper-service-token'

const client = new ServiceTokenClient({
  accessKey: 'doorkeeper_client_access_key',
  secretKey: '0123456789',
  baseUrl: baseUrl
})
const BODY = {
  data: {
    type: 'users',
    id: '5490143e69e49d0c8f9fc6bc',
    attributes: {
      'first_name': 'Roger',
      'last_name': 'Rabbit'
    }
  }
}

function mockBody (body, status = 200) {
  const jsonBody = JSON.stringify(body)

  return (url, options) => {
    if (options.headers.get('Authorization').match(/^APIAuth-HMAC-SHA1 doorkeeper_client_access_key:/)) {
      return {
        body: jsonBody,
        status: status
      }
    } else {
      return {
        body: { message: 'Access forbidden' },
        status: 401
      }
    }
  }
}

/**
 * Use 'done()' for asynchronous Jasmine testing.
 * https://jasmine.github.io/tutorials/async
 */
describe('DoorkeeperClient', () => {
  describe('#baseUrl', () => {
    it('should be a valid url', () => {
      expect(client.baseUrl).to.eql(baseUrl)
    })
  })

  describe('#createServiceToken', () => {
    describe('on success', () => {
      beforeEach(() => {
        fetchMock.post(`${baseUrl}/api/tokens/service_token`,
          mockBody(BODY)
        )
      })

      it('should return json', (done) => {
        const promise = client.createServiceToken({ userId: userId })
        promise.then(body => {
          expect(body.id).to.eql(BODY.data.id)
          expect(body.firstName).to.eql(BODY.data.attributes.first_name)
          expect(body.lastName).to.eql(BODY.data.attributes.last_name)
          done()
        })
      })
    })
  })

  describe('#verifyServiceToken', () => {
    describe('on success', () => {
      beforeEach(() => {
        fetchMock.get(`${baseUrl}/api/users/authenticate?service_token=${serviceToken}`,
          mockBody(BODY)
        )
      })

      it('should return json', (done) => {
        const promise = client.verifyServiceToken({ serviceToken: serviceToken })
        promise.then(body => {
          expect(body.id).to.eql(BODY.data.id)
          expect(body.firstName).to.eql(BODY.data.attributes.first_name)
          expect(body.lastName).to.eql(BODY.data.attributes.last_name)
          done()
        })
      })
    })
  })
})
