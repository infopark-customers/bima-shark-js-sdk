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

    Object.assign(
      {}
    )

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
    const url = buildUrl(this.baseUrl, null, parameters)
    return this.sendRequest(url)
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  find (id, parameters = {}) {
    const url = buildUrl(this.baseUrl, id, parameters)
    return this.sendRequest(url)
  }

  /**
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  create (data, parameters = {}) {
    const url = buildUrl(this.baseUrl, null, parameters)

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
    const url = buildUrl(this.baseUrl, id, parameters)

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
    const url = buildUrl(this.baseUrl, id, parameters)

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
    const url = buildUrl(this.baseUrl, id, parameters)
    return this.sendRequest(url, {
      method: 'DELETE'
    })
  }

  /**
   * Makes an http request and returns a promise.
   *
   * @param  {string} [url] the url
   * @param  {object} [options] the options we want to pass to 'fetch'
   *   - body   can be null
   *   - method must be GET, POST, PUT, PATCH or DELETE. Default is GET.
   *
   * @return {promise} the sendRequest promise
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
