'use strict'

const param = require('jquery-param')
const Deserializer = require('../../jsonapi-serializer/deserializer')
const { isString } = require('../../utils/typecheck')
const signedFetch = require('../../utils/signed-fetch')

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
class ServiceTokenValidator {
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

module.exports = ServiceTokenValidator
