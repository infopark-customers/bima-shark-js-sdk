'use strict'

const param = require('jquery-param')
const ServiceTokenBase = require('./base')

/**
 * @class ServiceTokenValidator
 * @classdesc Helper class to verify service tokens in a Node.js environment.
 *
 * @param {object} [options] the options
 *   - accessKey {string}
 *   - secretKey {string}
 *   - doorkeeperUrl {string}
 *   - digest {string}
 */
class ServiceTokenValidator extends ServiceTokenBase {
  /**
   * Verifies if a service token is still valid.
   *
   * @return {Promise} the fetch promise
   */
  verifyServiceToken (params, options = {}) {
    const authenticateParams = Object.assign({}, params)
    authenticateParams.service_token = authenticateParams.serviceToken
    delete authenticateParams.serviceToken

    const url = `${this.doorkeeperUrl}/api/users/authenticate?${param(authenticateParams)}`
    const requestOptions = Object.assign({
      method: 'GET'
    }, options)

    return this.__request(url, requestOptions)
  }
}

module.exports = ServiceTokenValidator
