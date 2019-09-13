/* eslint-env jest */
'use strict'

const sharkFetch = require('../../src/utils/shark-fetch')

describe('#sharkFetch', () => {
  const url = 'http://echo.jsontest.com/key/value/one/two'
  const expectedJson = {
    one: 'two',
    key: 'value'
  }

  describe('with url', () => {
    it('should return json', (done) => {
      const promise = sharkFetch(url)
      promise.then(json => {
        expect(json).toEqual(expectedJson)
        done()
      })
    })
  })

  describe('with url and options', () => {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/vnd.api+json'
      }
    }

    it('should return json', (done) => {
      const promise = sharkFetch(url, options)
      promise.then(json => {
        expect(json).toEqual(expectedJson)
        done()
      })
    })
  })

  describe('with text response', () => {
    it('should return { message: RESPONSE_BODY }', (done) => {
      const promise = sharkFetch('http://www.example.com')
      promise.then(json => {
        expect(json.message).toMatch(/<title>Example Domain<\/title>/)
        done()
      })
    })
  })

  describe('with error response', () => {
    const expectError = {
      errors: [{
        detail: 'request to http://invalid.foobar.domain/ failed, reason: getaddrinfo ENOTFOUND invalid.foobar.domain invalid.foobar.domain:80',
        status: 503,
        title: 'request to http://invalid.foobar.domain/ failed, reason: getaddrinfo ENOTFOUND invalid.foobar.domain invalid.foobar.domain:80'
      }]
    }

    it('should return error object', (done) => {
      const promise = sharkFetch('http://invalid.foobar.domain')
      promise.then(json => {
        console.log(json)
        done(new Error('#sharkFetch with error response was resolved, but it should fail!'))
      }, (error) => {
        expect(error).toEqual(expectError)
        done()
      })
    })
  })
})
