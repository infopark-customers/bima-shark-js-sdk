/* eslint-env jest */
'use strict'

const nock = require('nock')
const sharkFetch = require('../../src/utils/shark-fetch')

describe('#sharkFetch', () => {
  const baseUrl = 'http://echo.jsontest.com'
  const path = '/key/value/one/two'
  const expectedJson = { one: 'two', key: 'value' }

  beforeEach(() => {
    nock.cleanAll()
  })

  it('should return json with GET', async () => {
    nock(baseUrl)
      .get(path)
      .reply(200, expectedJson)

    const json = await sharkFetch(`${baseUrl}${path}`)
    expect(json).toEqual(expectedJson)
  })

  it('should return json with POST and headers', async () => {
    nock(baseUrl)
      .post(path)
      .matchHeader('content-type', 'application/vnd.api+json')
      .reply(200, expectedJson)

    const json = await sharkFetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/vnd.api+json'
      }
    })
    expect(json).toEqual(expectedJson)
  })

  it('should return text for non-JSON responses', async () => {
    nock('http://www.example.com')
      .get('/')
      .reply(200, '<html><title>Example Domain</title></html>', {
        'content-type': 'text/html'
      })

    const text = await sharkFetch('http://www.example.com')
    expect(text).toMatch(/<title>Example Domain<\/title>/)
  })

  it('should return error object on fetch failure', async () => {
    const errorJson = {
      errors: [{
        detail: 'fetch failed',
        status: 503,
        title: 'fetch failed'
      }]
    }

    nock('http://invalid.foobar.domain')
      .get('/')
      .replyWithError('fetch failed')

    try {
      await sharkFetch('http://invalid.foobar.domain')
      throw new Error('This should not be reached')
    } catch (err) {
      expect(err).toEqual(errorJson)
    }
  })
})
