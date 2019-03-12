'use strict'

const Config = require('../config')
const Cache = require('../cache')
const Deserializer = require('../jsonapi-serializer/deserializer')
const { isString } = require('../utils/typecheck')
const simpleFetch = require('../utils/simple-fetch')

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
      throw new Error('Parameter `baseUrl` is missing or not a string')
    }
  }

  /**
   * @return {Promise} the fetch promise
   */
  createServiceToken () {
    const cacheKey = this.cacheKey()
    const token = Cache.lookup(cacheKey)

    if (token && token.expiresAt) {
      let now = new Date()
      let date = new Date(token.expiresAt)
      if (date < now) {
        return this.__request()
      } else {
        return Promise.resolve(token)
      }
    } else {
      return this.__request()
    }
  }

  __request () {
    const cacheKey = this.cacheKey()
    const csrfToken = this.csrfToken()

    Cache.remove(cacheKey)

    return simpleFetch(this.baseUrl,
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
