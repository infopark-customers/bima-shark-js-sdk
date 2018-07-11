/* eslint-env jasmine */
'use strict'

import Config from 'src/shark/config'
import ServiceToken from 'src/shark/service_token'
import ServerError from 'src/shark/server_error'

import { setup, teardown, TEST } from 'test/test_helper'

/*
 * Use 'done()' for asynchronous Jasmine testing.
 * https://jasmine.github.io/tutorials/async
 */
describe('ServiceToken.create', function () {
  teardown()

  describe('on success', function () {
    setup.serviceTokenSuccess()

    it('should create a Promise', function () {
      const promise = ServiceToken.create()
      expect(promise instanceof Promise).toEqual(true)
    })

    it('should create a Promise that resolves to a JWT', function (done) {
      const promise = ServiceToken.create()
      promise.then(token => {
        expect(token).toEqual(TEST.JWT)
        done()
      })
    })
  })

  describe('on failure', function () {
    setup.serviceTokenError()

    it('should create a Promise that is rejected', function (done) {
      const promise = ServiceToken.create()
      promise.then(token => {
        done.fail('ServiceToken.create() was resolved, but it should fail!')
      }, error => {
        expect(error instanceof ServerError).toEqual(true)
        expect(error.status).toEqual(500)
        expect(error.json.message).toEqual('internal server error')
        done()
      })
    })
  })
})

describe('ServiceToken.reset', function () {
  const key = `api-service-token/${Config.secret}`
  const subject = new ServiceToken({ url: Config.serviceTokenUrl })

  beforeEach(() => {
    subject.storage[key] = '0123456789'
  })

  it('should remove stored service token', function () {
    ServiceToken.reset()
    expect(subject.storage[key]).toEqual(undefined)
  })
})
