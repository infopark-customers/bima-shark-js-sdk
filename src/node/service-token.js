'use strict'

const Cache = require('../cache')
const Deserializer = require('../jsonapi-serializer/deserializer')
const { isString } = require('../utils/typecheck')
const signedFetch = require('../utils/signed-fetch')

const deserializer = new Deserializer({
  keyForAttribute: 'camelCase',
  caseConversionStopPaths: { permissions: ['rules'] }
})

/**
 * @class ServiceTokenClient
 * @classdesc Helper class to request and manage a valid service token in a NodeJS environment.
 *
 * @param {object} [options] the options
 *   - accessKey {string}
 *   - secretKey {string}
 *   - baseUrl {string}
 *   - digest {string} (defaults to 'sha1')
 *   - userId {string}
 *
 * @throws {Error} if baseUrl is invalid
 * @throws {Error} if accessKey is invalid
 * @throws {Error} if secretKey is invalid
 */
class ServiceTokenClient {
  constructor (options = {}) {
    this.accessKey = options.accessKey
    this.secretKey = options.secretKey
    this.digest = options.digest || 'sha1'
    this.baseUrl = options.baseUrl

    if (!isString(this.baseUrl)) {
      throw new Error('Key `baseUrl` in `options` parameter is missing or not a string')
    }
    if (!isString(this.accessKey)) {
      throw new Error('Key `accessKey` in `options` parameter is missing or not a string')
    }
    if (!isString(this.secretKey)) {
      throw new Error('Key `secretKey` in `options` parameter is missing or not a string')
    }

    this.userId = options.userId
  }

  /**
   * Create a new service token.
   *
   * @return {Promise} the fetch promise
   */
  createServiceToken (options = {}) {
    const cacheKey = this.cacheKey()
    const token = Cache.lookup(cacheKey)

    if (token && token.expiresAt) {
      const now = new Date()
      const date = new Date(token.expiresAt)
      if (date < now) {
        return this.requestServiceToken(options)
      } else {
        return Promise.resolve(token)
      }
    } else {
      return this.requestServiceToken(options)
    }
  }

  /**
   * Verifies if a service token is still valid.
   *
   * @return {Promise} the fetch promise
   */
  verifyServiceToken (params, options = {}) {
    const body = Object.assign({}, params)
    body.service_token = body.service_token || body.serviceToken
    delete body.serviceToken

    const url = `${this.baseUrl}/api/users/authenticate`
    const requestOptions = Object.assign({
      method: 'POST',
      body: body
    }, options)

    return this.signedRequest(url, requestOptions)
  }

  requestServiceToken (options = {}) {
    const cacheKey = this.cacheKey()
    Cache.remove(cacheKey)

    const url = `${this.baseUrl}/api/tokens/service_token`
    const requestOptions = Object.assign({
      method: 'POST',
      body: {
        user_id: this.userId
      }
    }, options)

    return this.signedRequest(url, requestOptions).then(token => {
      Cache.store(cacheKey, token)
      return token
    })
  }

  signedRequest (url, options = {}) {
    const headers = Object.assign({
      'content-type': 'application/vnd.api+json'
    }, options.headers || {})
    const requestOptions = Object.assign({}, options, {
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      digest: this.digest,
      headers: headers
    })

    return signedFetch(url, requestOptions).then(json => {
      return deserializer.deserialize(json)
    })
  }

  cacheKey () {
    return `api-service-token/${this.userId}`
  }
}

module.exports = ServiceTokenClient
