'use strict'

const Deserializer = require('../../jsonapi-serializer/deserializer')
const { isString } = require('../../utils/typecheck')
const signedFetch = require('../../utils/signed-fetch')

const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })

/**
 * @class ServiceTokenBase
 *
 * @param {object} [options] the options
 *   - accessKey {string}
 *   - secretKey {string}
 *   - doorkeeperUrl {string}
 *   - digest {string}
 */
class ServiceTokenBase {
  constructor (options) {
    this.accessKey = options.accessKey
    this.secretKey = options.secretKey
    this.digest = options.digest || 'sha1'
    this.doorkeeperUrl = options.doorkeeperUrl

    if (!isString(this.doorkeeperUrl)) {
      throw new Error('Key `doorkeeperUrl` in `options` parameter is missing or not a string')
    }
    if (!isString(this.accessKey)) {
      throw new Error('Key `accessKey` in `options` parameter is missing or not a string')
    }
    if (!isString(this.secretKey)) {
      throw new Error('Key `secretKey` in `options` parameter is missing or not a string')
    }
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

module.exports = ServiceTokenBase
