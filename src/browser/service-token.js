'use strict'

const Config = require('../config')
const Cache = require('../cache')
const Deserializer = require('../jsonapi-serializer/deserializer')
const { isString } = require('../utils/typecheck')
const sharkFetch = require('../utils/shark-fetch')

const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })

/**
 * @class ServiceTokenClient
 * @classdesc Helper class to request and manage a valid service token in a browser environment.
 *
 * @param {object} [options] the options
 *   - baseUrl {string}
 *
 * @throws {Error} if baseUrl is invalid
 */
class ServiceTokenClient {
  constructor (options = {}) {
    this.baseUrl = options.baseUrl

    if (!isString(this.baseUrl)) {
      throw new Error('Key `baseUrl` in `options` parameter is missing or not a string')
    }
  }

  /**
   * @return {Promise} the fetch promise
   */
  createServiceToken () {
    const cacheKey = this.cacheKey()
    const token = Cache.lookup(cacheKey)

    if (token && token.expiresAt) {
      const now = new Date()
      const date = new Date(token.expiresAt)
      if (date < now) {
        return this.request()
      } else {
        return Promise.resolve(token)
      }
    } else {
      return this.request()
    }
  }

  /**
   * Verifies if a service token is still valid.
   *
    * @throws {Error}
   */
  verifyServiceToken (params, options = {}) {
    throw new Error('ServiceTokenClient does not implement #verifyServiceToken for browser enviroments')
  }

  request () {
    const cacheKey = this.cacheKey()
    const csrfToken = this.csrfToken()

    Cache.remove(cacheKey)

    return sharkFetch(this.baseUrl,
      {
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/vnd.api+json',
          'x-csrf-token': csrfToken
        },
        method: 'POST'
      })
      .then(json => {
        const data = json.data ? json : { data: json }
        const token = deserializer.deserialize(data)
        Cache.store(cacheKey, token)
        return token
      })
  }

  cacheKey () {
    return `api-service-token/${Config.secret}`
  }

  csrfToken () {
    const metaTags = document.getElementsByTagName('META')
    try {
      return metaTags['csrf-token'].content
    } catch (e) {
      return ''
    }
  }
}

module.exports = ServiceTokenClient
