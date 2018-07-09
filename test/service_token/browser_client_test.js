/* eslint-env mocha */
/* global expect */
'use strict'

import Config from 'src/shark/config'
import ServiceTokenClient from 'src/shark/service_token/browser_client'

import { setup, teardown, TEST } from 'test/test_helper'

const client = new ServiceTokenClient()

describe('ServiceTokenClient#createServiceToken', () => {
  teardown()

  describe('on success', () => {
    setup.serviceTokenSuccess()

    it('should create a Promise', () => {
      const promise = client.createServiceToken()
      expect(promise instanceof Promise).to.eql(true)
    })

    it('should create a Promise that resolves to a JWT', (done) => {
      const promise = client.createServiceToken()
      promise.then(token => {
        expect(token).to.eql(TEST.JWT)
        done()
      })
    })
  })

  describe('on failure', () => {
    setup.serviceTokenError()

    it('should create a Promise that is rejected', (done) => {
      const promise = client.createServiceToken()
      promise.then(token => {
        done.fail('ServiceTokenClient.create() was resolved, but it should fail!')
      }, error => {
        expect(Array.isArray(error.errors)).to.eql(true)
        expect(error.errors[0].status).to.eql(500)
        expect(error.errors[0].detail).to.eql('internal server error')
        done()
      })
    })
  })
})

describe('ServiceTokenClient.reset', () => {
  const key = `api-service-token/${Config.secret}`
  const subject = new ServiceTokenClient({ url: Config.serviceTokenUrl })

  beforeEach(() => {
    subject.storage[key] = '0123456789'
  })

  it('should remove stored service token', () => {
    ServiceTokenClient.reset()
    expect(subject.storage[key]).to.eql(undefined)
  })
})
