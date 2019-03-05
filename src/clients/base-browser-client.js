'use strict'

const param = require('jquery-param')

const { isString } = require('../utils/typecheck')
const simpleFetch = require('../utils/simple-fetch')

const BaseClient = require('./base-client')
const ServiceTokenClient = require('../service-token/browser')

// TODO hack empty arrays?

/**
 * @class Client
 * @classdesc Basic REST client that can be instantiated for different models.
 *
 * @throws Will raise error if baseUrl is invalid
 */
class Client extends BaseClient {
  constructor (options = {}) {
    super()

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

  buildUrl (path, parameters) {
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
