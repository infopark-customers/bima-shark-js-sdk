'use strict'

const param = require('jquery-param')
const { isString } = require('../utils/typecheck')
const simpleFetch = require('../utils/simple-fetch')
const ServiceTokenClient = require('../service-token/browser')

// TODO hack empty arrays?

/**
 * @class Client
 * @classdesc Basic REST client that can be instantiated for different models.
 *
 * @throws Will raise error if baseUrl is invalid
 */
class Client {
  constructor (options = {}) {
    this.name = options.name
    this.baseUrl = options.url
    this.config = {
      authorizationRequired: true,
      contentType: options.contentType || 'application/vnd.api+json'
    }

    if (this.baseUrl && isString(this.baseUrl)) {
      if (this.baseUrl[0] === '/') {
        this.config.authorizationRequired = false
      }
    } else {
      throw new Error('Parameter url is missing or not a string')
    }
  }

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
    const opts = {
      headers: {
        'Content-Type': this.config.contentType
      },
      method: (options.method || 'GET').toUpperCase()
    }

    if (options.body) {
      opts.body = JSON.stringify(options.body)
    }

    if (this.config.authorizationRequired) {
      const tokenClient = new ServiceTokenClient()
      return tokenClient.createServiceToken().then(token => {
        opts.headers['Authorization'] = `Bearer ${token.jwt}`
        return simpleFetch(url, opts)
      })
    } else {
      opts.credentials = 'same-origin'
      return simpleFetch(url, opts)
    }
  }

  /**
   * Uploads file and returns promise.
   *
   * @param {string} path the path
   * @param {FormData} data the FormData object with file
   *
   * @return {promise} the uploadFile promise
   */
  uploadFile (path, data, parameters = {}) {
    const url = this.__buildUrl(path, parameters)
    const opts = {
      headers: {},
      body: data,
      method: 'POST'
    }

    if (this.config.authorizationRequired) {
      const tokenClient = new ServiceTokenClient()
      return tokenClient.createServiceToken().then(token => {
        opts.headers['Authorization'] = `Bearer ${token.jwt}`
        return simpleFetch(url, opts)
      })
    } else {
      opts.credentials = 'same-origin'
      return simpleFetch(url, opts)
    }
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

module.exports = Client
