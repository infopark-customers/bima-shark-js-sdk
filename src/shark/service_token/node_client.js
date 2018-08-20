'use strict'

const param = require('jquery-param')
const Deserializer = require('../../jsonapi-serializer/deserializer')
const { isString } = require('../../utils/typecheck')
const signedFetch = require('../../utils/signed_fetch')

const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })

/**
 * @class ServiceTokenClient
 * @classdesc Helper class to request and manage a valid service token in a NodeJS environment.
 *
 * @param {object} [options] the options
 *   - accessKey {string}
 *   - secretKey {string}
 *   - baseUrl {string}
 */
class ServiceTokenClient {
  /**
   * Remove stored service token
   */
  static reset () {
  }

  constructor (options = {}) {
    this.accessKey = options.accessKey
    this.secretKey = options.secretKey
    this.digest = options.digest || 'sha1'
    this.baseUrl = options.baseUrl

    if (!isString(this.baseUrl)) {
      throw new Error('Parameter `baseUrl` is missing or not a string')
    }
    if (!isString(this.accessKey)) {
      throw new Error('Parameter `accessKey` is missing or not a string')
    }
    if (!isString(this.secretKey)) {
      throw new Error('Parameter `secretKey` is missing or not a string')
    }
  }

  /**
   * Create a new service token.
   *
   * @return {Promise} the fetch promise
   */
  createServiceToken (params, options = {}) {
    const url = `${this.baseUrl}/api/tokens/service_token`
    const { userId, customClaims } = params
    const requestOptions = Object.assign({
      method: 'POST',
      body: {
        user_id: userId,
        custom_claims: customClaims || {}
      }
    }, options)

    return this.__request(url, requestOptions)
  }

  /**
   * Verifies if a service token is still valid.
   *
   * @return {Promise} the fetch promise
   */
  verifyServiceToken (params, options = {}) {
    const authenticateParams = Object.assign({}, params)
    authenticateParams.service_token = authenticateParams.serviceToken
    delete authenticateParams.serviceToken

    const url = `${this.baseUrl}/api/users/authenticate?${param(authenticateParams)}`
    const requestOptions = Object.assign({
      method: 'GET'
    }, options)

    return this.__request(url, requestOptions)
  }

  __request (url, options = {}) {
    const headers = Object.assign({
      'Content-Type': 'application/vnd.api+json'
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
}

module.exports = ServiceTokenClient