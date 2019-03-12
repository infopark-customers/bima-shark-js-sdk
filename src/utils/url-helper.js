'use strict'

const param = require('jquery-param')

module.exports.buildUrl = (baseUrl, path, parameters) => {
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
