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
    it('should return response.body', (done) => {
      const promise = sharkFetch('http://www.example.com')
      promise.then(body => {
        expect(body).toMatch(/<title>Example Domain<\/title>/)
        done()
      })
    })
  })

  describe('with error response', () => {
    const expectError = {
      errors: [{
        detail: 'fetch failed',
        status: 503,
        title: 'fetch failed'
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
