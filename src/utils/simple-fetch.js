'use strict'

const { fetch, Headers } = require('../proxy')
const Logger = require('../logger')
const { jsonApiError } = require('./response-helper')

/**
 * Parses the JSON returned by a network request.
 * Inspired by https://github.com/github/fetch/issues/203#issuecomment-266034180
 *
 * @param  {object} response A response from a network request
 * @return {object} The parsed JSON, status from the response
 */
function parse (response) {
  return new Promise(resolve => {
    return response.text().then(text => {
      // TODO inspect response headers?
      // TODO inspect content length?

      let json = {}
      if (text) {
        try {
          json = JSON.parse(text)
        } catch (e) {
          json = { message: text }
        }
      }

      return resolve({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        json: json
      })
    })
  })
}

/**
 * Handles errors during the fetch network request.
 *
 * @param  {object} error
 * @return {object}
 */
function error (e) {
  return new Promise(resolve => {
    return resolve({
      statusText: e.message,
      ok: false,
      json: {
        errors: [{ status: 503, title: e.message, detail: e.message }]
      }
    })
  })
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to 'fetch'
 *
 * @return {Promise}           The request promise
 */
function simpleFetch (url, options) {
  Logger.debugLog('request: ', url, options)

  if (url.startsWith('http:')) {
    if (options.headers instanceof Headers) {
      options.headers.set('x-forwarded-proto', 'https')
    } else {
      options.headers['x-forwarded-proto'] = 'https'
    }
  }

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(parse, error)
      .then(response => {
        Logger.debugLog('response: ', response)
        if (response.ok) {
          return resolve(response.json)
        } else {
          const error = jsonApiError(response)
          return reject(error)
        }
      })
  })
}

module.exports = simpleFetch
