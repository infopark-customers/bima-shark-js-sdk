'use strict'

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
 *   - userId {string}
 *   - customClaims {object}
 */
class ServiceTokenClient {
  constructor (options) {
    this.accessKey = options.accessKey
    this.secretKey = options.secretKey
    this.digest = options.digest || 'sha1'
    this.baseUrl = options.baseUrl

    this.userId = options.userId
    this.customClaims = options.customClaims || {}

    this.cachedToken = null

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
   * Create a new service token.
   *
   * @return {Promise} the fetch promise
   */
  createServiceToken () {
    const url = `${this.baseUrl}/api/tokens/service_token`

    const requestOptions = {
      method: 'POST',
      body: {
        user_id: this.userId,
        custom_claims: this.customClaims
      }
    }

    const token = this.cachedToken

    if (token && token.expiresAt) {
      let now = new Date()
      let date = new Date(token.expiresAt)

      if (date < now) {
        return this.__request(url, requestOptions)
      } else {
        return new Promise((resolve, reject) => { resolve(token) })
      }
    } else {
      return this.__request(url, requestOptions)
    }
  }

  /**
   * Remove stored service token
   */
  static reset () {
    this.cachedToken = null
  }

  __request (url, options = {}) {
    const requestOptions = Object.assign({}, options, {
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      digest: this.digest,
      headers: { 'Content-Type': 'application/vnd.api+json' }
    })

    return signedFetch(url, requestOptions).then(json => {
      return deserializer.deserialize(json)
    })
  }
}

module.exports = ServiceTokenClient
