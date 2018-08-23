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
 *   - url {string}
 */
class ServiceTokenClient {
  constructor (options = {}) {
    this.url = options.url || Config.serviceTokenUrl

    if (!isString(this.url)) {
      throw new Error('Parameter `url` is missing or not a string')
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
        return new Promise((resolve, reject) => { resolve(token) })
      }
    } else {
      return this.__request()
    }
  }

  __request () {
    const cacheKey = this.cacheKey()
    const csrfToken = this.csrfToken()

    Cache.remove(cacheKey)

    return simpleFetch(this.url,
      {
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': csrfToken
        },
        method: 'POST'
      })
      .then(json => {
        const token = deserializer.deserialize({ data: json })
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
