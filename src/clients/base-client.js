'use strict'

const param = require('jquery-param')

/**
 * @class Client
 * @classdesc Basic REST client that can be instantiated for different models.
 *
 * @throws Will raise error if baseUrl is invalid
 */
class BaseClient {
  /**
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  search (parameters = {}) {
    const url = this.__buildUrl(null, parameters)
    return this.sendRequest(url)
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  find (id, parameters = {}) {
    const url = this.__buildUrl(id, parameters)
    return this.sendRequest(url)
  }

  /**
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  create (data, parameters = {}) {
    const url = this.__buildUrl(null, parameters)

    return this.sendRequest(url, {
      body: data,
      method: 'POST'
    })
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  update (id, data, parameters = {}) {
    const url = this.__buildUrl(id, parameters)

    return this.sendRequest(url, {
      body: data,
      method: 'PUT'
    })
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  patch (id, data, parameters = {}) {
    const url = this.__buildUrl(id, parameters)

    return this.sendRequest(url, {
      body: data,
      method: 'PATCH'
    })
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  destroy (id, parameters = {}) {
    const url = this.__buildUrl(id, parameters)
    return this.sendRequest(url, {
      method: 'DELETE'
    })
  }

  __buildUrl (path, parameters) {
    let url = this.baseUrl
    let urlPath = path || ''
    let queryString = param(parameters)

    if (url.slice(-1) !== '/') { url += '/' }
    urlPath = urlPath.toString()
    if (urlPath[0] === '/') { urlPath = urlPath.slice(1) }
    url += urlPath
    if (queryString.length > 0) { url += `?${queryString}` }

    return url
  }
}

module.exports = BaseClient
