'use strict'

const { isString } = require('../utils/typecheck')
const simpleFetch = require('../utils/simple-fetch')

const BaseClient = require('./base-client')
const ServiceTokenClient = require('../service-token/node')

/**
 * @class Client
 * @classdesc Basic REST client that can be instantiated for different models.
 *
 * @throws Will raise error if baseUrl, doorkeeperBaseUrl, accessKey or secretKey is invalid
 */
class Client extends BaseClient {
  constructor (options) {
    super()

    this.name = options.name
    this.baseUrl = options.url

    this.config = {
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      doorkeeperBaseUrl: options.doorkeeperBaseUrl,
      contentType: options.contentType || 'application/vnd.api+json'
    }

    if (!isString(this.baseUrl)) {
      throw new Error('Parameter `url` is missing or not a string')
    }
    if (!isString(this.config.doorkeeperBaseUrl)) {
      throw new Error('Parameter `doorkeeperBaseUrl` is missing or not a string')
    }
    if (!isString(this.config.accessKey)) {
      throw new Error('Parameter `accessKey` is missing or not a string')
    }
    if (!isString(this.config.secretKey)) {
      throw new Error('Parameter `secretKey` is missing or not a string')
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

    const tokenClient = new ServiceTokenClient({
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      baseUrl: this.config.doorkeeperBaseUrl
    })

    return tokenClient.createServiceToken().then(token => {
      opts.headers['Authorization'] = `Bearer ${token.jwt}`
      return simpleFetch(url, opts)
    })
  }
}

module.exports = Client
