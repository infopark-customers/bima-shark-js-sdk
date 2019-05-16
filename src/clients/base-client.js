'use strict'

const { isString } = require('../utils/typecheck')
const { buildUrl } = require('../utils/url-helper')
const simpleFetch = require('../utils/simple-fetch')
const Config = require('../config')
const SharkProxy = require('../proxy')

/**
 * @class Client
 * @classdesc Basic REST client that can be instantiated for different models.
 *
 * @param {object} [options] the options
 *   - url {string} required
 *   - name {string}
 *   - contentType {string}
 *   - serviceToken {object}
 *
 * @throws {Error} if baseUrl is invalid
 * @throws {Error} if tokenClient cannot be instantiated
 */
class BaseClient {
  constructor (options = {}) {
    this.authorizationRequired = true
    this.name = options.name
    this.baseUrl = options.url
    this.contentType = options.contentType || 'application/vnd.api+json'

    if (this.baseUrl && isString(this.baseUrl)) {
      if (this.baseUrl[0] === '/') {
        this.authorizationRequired = false
      }
    } else {
      throw new Error('Parameter `url` is missing or not a string')
    }

    const serviceTokenOptions = Object.assign(
      { baseUrl: Config.serviceTokenUrl },
      options.serviceToken
    )
    this.tokenClient = new SharkProxy.ServiceTokenClient(serviceTokenOptions)
  }

  /**
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  search (parameters = {}) {
    return this.get(null, parameters)
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  find (id, parameters = {}) {
    return this.get(id, parameters)
  }

  /**
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  create (data, parameters = {}) {
    return this.post('', data, parameters)
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  update (id, data, parameters = {}) {
    return this.put(id, data, parameters)
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  destroy (id, parameters = {}) {
    return this.delete(id, parameters)
  }

  /**
   * @param  {string} [path] The path after the base url, can also be an id (integer).
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  get (path, parameters = {}) {
    const url = buildUrl(this.baseUrl, path, parameters)

    return this.sendRequest(url, {
      method: 'GET'
    })
  }

  /**
   * @param  {string} [path] The path after the base url, can also be an id (integer).
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  post (path, data, parameters = {}) {
    const url = buildUrl(this.baseUrl, path, parameters)

    return this.sendRequest(url, {
      body: data,
      method: 'POST'
    })
  }

  /**
   * @param  {string} [path] The path after the base url, can also be an id (integer).
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  patch (path, data, parameters = {}) {
    const url = buildUrl(this.baseUrl, path, parameters)

    return this.sendRequest(url, {
      body: data,
      method: 'PATCH'
    })
  }

  /**
   * @param  {string} [path] The path after the base url, can also be an id (integer).
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  put (path, data, parameters = {}) {
    const url = buildUrl(this.baseUrl, path, parameters)

    return this.sendRequest(url, {
      body: data,
      method: 'PUT'
    })
  }

  /**
   * @param  {string} [path] The path after the base url, can also be an id (integer).
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  delete (path, parameters = {}) {
    const url = buildUrl(this.baseUrl, path, parameters)

    return this.sendRequest(url, {
      method: 'DELETE'
    })
  }

  /**
   * @api private
   */
  sendRequest (url, options = {}) {
    const requestOptions = {
      headers: {
        'content-type': this.contentType
      },
      method: (options.method || 'GET').toUpperCase()
    }

    if (options.body) {
      requestOptions.body = JSON.stringify(options.body)
    }

    if (this.authorizationRequired) {
      return this.tokenClient.createServiceToken({}).then(token => {
        requestOptions.headers['authorization'] = `Bearer ${token.jwt}`
        return simpleFetch(url, requestOptions)
      })
    } else {
      requestOptions.credentials = 'same-origin'
      return simpleFetch(url, requestOptions)
    }
  }
}

module.exports = BaseClient
