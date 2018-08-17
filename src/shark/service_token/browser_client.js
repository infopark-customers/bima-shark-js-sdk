'use strict'

const { isString } = require('../../utils/typecheck')
const simpleFetch = require('../../utils/simple_fetch')
const Config = require('../config')

const TOKEN_STORAGE = {}

/**
 * @class ServiceTokenClient
 * @classdesc Helper class to request and manage a valid service token in a browser environment.
 *
 * @param {object} [options] the options
 *   - url {string}
 */
class ServiceTokenClient {
  /**
   * Remove stored service token
   */
  static reset () {
    const client = new ServiceTokenClient({
      url: Config.serviceTokenUrl
    })

    client.remove()
  }

  constructor (options = {}) {
    this.url = options.url || Config.serviceTokenUrl
    this.storage = TOKEN_STORAGE
    this.tokenStorageKey = `api-service-token/${Config.secret}`

    if (!isString(this.url)) {
      throw new Error('Parameter `url` is missing or not a string')
    }
  }
  /**
   * @return {Promise} the fetch promise
   */
  createServiceToken () {
    const token = this.lookup()

    if (token && token.expires_at) {
      let now = new Date()
      let date = new Date(token.expires_at)
      if (date < now) {
        return this.__request()
      } else {
        return new Promise((resolve, reject) => { resolve(token.jwt) })
      }
    } else {
      return this.__request()
    }
  }

  __request () {
    const self = this
    const crsfToken = this.crsfToken()
    this.remove()

    return simpleFetch(this.url,
      {
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': crsfToken
        },
        method: 'POST'
      })
      .then(json => {
        const token = json.attributes || json.data.attributes
        self.store(token)
        return token.jwt
      })
  }

  lookup () {
    return this.storage[this.tokenStorageKey]
  }

  store (token) {
    this.storage[this.tokenStorageKey] = token
    return token
  }

  remove () {
    delete this.storage[this.tokenStorageKey]
  }

  crsfToken () {
    const metaTags = document.getElementsByTagName('META')
    try {
      return metaTags['csrf-token'].content
    } catch (e) {
      return ''
    }
  }
}

module.exports = ServiceTokenClient
