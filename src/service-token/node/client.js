'use strict'

const ServiceTokenBase = require('./base')

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
class ServiceTokenClient extends ServiceTokenBase {
  constructor (options) {
    super(options)

    this.userId = options.userId
    this.customClaims = options.customClaims || {}

    this.cachedToken = null
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
}

module.exports = ServiceTokenClient
