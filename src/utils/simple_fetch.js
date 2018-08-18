/* global Headers */
'use strict'

import URL from 'url'
import Config from 'src/shark/config'
import Error from 'src/jsonapi-serializer/error'

// From https://github.com/github/fetch/issues/203#issuecomment-266034180

/**
 * Parses the JSON returned by a network request.
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

function logDebug () {
  if (Config.debug) { console.log.apply(null, arguments) }
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to 'fetch'
 *
 * @return {Promise}           The request promise
 */
export default function simpleFetch (url, options) {
  logDebug('[Shark] request: ', url)

  if (URL.parse(url).protocol === 'http:') {
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
        logDebug('[Shark] response: ', response)
        if (response.ok) {
          return resolve(response.json)
        } else {
          const error = jsonApiError(response)
          return reject(error)
        }
      })
  })
}

function jsonApiError (response) {
  const json = response.json
  let errors = []

  if (Array.isArray(json.errors)) {
    errors = json.errors
  } else {
    // This handles "legacy" errors from our services that haven't changed to
    // JSONAPI-compliant errors yet.
    let errorDetails = []
    if (json.messages) {
      errorDetails = json.messages
    } else if (json.message) {
      errorDetails = [json.message]
    } else {
      console.log('[Shark] unhandled response type: ', response)
      errorDetails = ['Unhandled error']
    }
    errors = errorDetails.map(detail => {
      return { status: response.status, title: response.statusText, detail: detail }
    })
  }

  return new Error(errors)
}
