'use strict'

import ClientError from 'src/shark/client_error'
import ServerError from 'src/shark/server_error'

// From https://github.com/github/fetch/issues/203#issuecomment-266034180

/**
 * Parses the JSON returned by a network request.
 *
 * @param  {object} response A response from a network request
 * @return {object} The parsed JSON, status from the response
 */
function parse (response) {
  return new Promise((resolve) => response.text()
    .then(text => {
      // TODO inspect response headers?
      // TODO inspect content length?

      var json = {}
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
  )
}

/**
 * Handles errors during the fetch network request.
 *
 * @param  {object} error
 * @return {object}
 */
function error (e) {
  return new Promise((resolve) => {
    return resolve({
      statusText: e.message,
      ok: false,
      json: { message: e.message }
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
export default function request (url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(parse, error)
      .then(response => {
        if (response.ok) {
          return resolve(response.json)
        } else if (response.status < 400) {
          return reject(new ClientError(
            response.status,
            response.message,
            response.json
          ))
        } else if (response.status < 500) {
          return reject(new ClientError(
            response.status,
            response.message,
            response.json
          ))
        } else if (response.status < 600) {
          return reject(new ServerError(
            response.status,
            response.message,
            response.json
          ))
        } else {
          return reject(new Error(response.message))
        }
      })
  })
}
