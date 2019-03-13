'use strict'

const param = require('jquery-param')

/**
 * @param  {string} [baseUrl] The base url.
 * @param  {string} [path] The path after the base url, can also be an id (integer).
 * @param  {object} [parameters] The query parameters as an object (optional).
 *
 * @return {string} The complete url.
 */
function buildUrl (baseUrl, path, parameters) {
  let url = baseUrl
  let urlPath = path || ''
  let queryString = param(parameters)

  if (url.slice(-1) !== '/') { url += '/' }
  urlPath = urlPath.toString()
  if (urlPath[0] === '/') { urlPath = urlPath.slice(1) }
  url += urlPath
  if (queryString.length > 0) { url += `?${queryString}` }

  return url
}

module.exports = {
  buildUrl
}
