'use strict'

import { isString } from 'src/utils/typecheck'
import request from 'src/utils/request'
import Config from 'src/shark/config'

/**
 * @class ServiceToken
 * @classdesc Helper class to request and manage a valid service token.
 */
class ServiceToken {
  /**
   * @return {Promise} the fetch promise
   * @api public
   */
  static create () {
    const client = new ServiceToken({
      url: Config.serviceTokenUrl,
      tokenStorageKey: `api-service-token/${Config.secret}`
    })

    const token = client.lookup()

    if (token && token.expires_at) {
      let now = new Date()
      let date = new Date(token.expires_at)
      if (date < now) {
        return client.requestToken()
      } else {
        return new Promise((resolve, reject) => { resolve(token.jwt) })
      }
    } else {
      return client.requestToken()
    }
  }

  /**
   * Remove stored service token
   *
   * @api public
   */
  static reset () {
    const client = new ServiceToken({
      url: Config.serviceTokenUrl,
      tokenStorageKey: `api-service-token/${Config.secret}`
    })

    client.remove()
  }

  constructor (options) {
    if (isString(options.url)) {
      this.url = options.url
    } else {
      throw new Error('Parameter url is missing or not a string')
    }

    this.storage = window.sessionStorage
    this.tokenStorageKey = options.tokenStorageKey
  }

  requestToken () {
    const self = this
    const crsfToken = this.crsfToken()
    self.remove()

    return request(this.url,
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
    const tokenString = this.storage.getItem(this.tokenStorageKey)
    return JSON.parse(tokenString)
  }

  store (token) {
    const tokenString = JSON.stringify(token)
    this.storage.setItem(this.tokenStorageKey, tokenString)
  }

  remove () {
    this.storage.removeItem(this.tokenStorageKey)
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

export default ServiceToken
