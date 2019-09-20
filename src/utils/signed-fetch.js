'use strict'

const crypto = require('crypto')
const url = require('url')

const { Headers } = require('../proxy')
const { isString } = require('./typecheck')
const sharkFetch = require('./shark-fetch')

function md5Base64digest (data) {
  return crypto.createHash('md5')
    .update(data)
    .digest('base64')
}

/**
 * @class SignedRequest
 * @classdesc Helper class to sign requests via HMAC before fetching the response.
 *
 * @param  {object} [options] The options for signing the request and options
 *                            for fetch.
 */
class SignedRequest {
  constructor (options = {}) {
    const optionKeys = ['accessKey', 'secretKey', 'digest', 'method', 'body']
    this.options = Object.assign({}, options)

    this.headers = new Headers(this.options.headers || {})
    delete this.options.headers

    this.url = new url.URL(options.url)
    delete this.options.url

    optionKeys.forEach((key) => {
      this[key] = this.options[key]
      delete this.options[key]
    })
  }

  /**
   * Sign the request via HMAC and fetch the response.
   *
   * @return {promise} The request promise.
   */
  fetch () {
    this.sign()

    const url = this.url.href
    const options = this.getOptions()

    return sharkFetch(url, options)
  }

  authorizationHeader () {
    const signature = crypto.createHmac(this.getDigest(), this.secretKey)
      .update(this.canonicalString())
      .digest('base64')

    return `APIAuth-HMAC-${this.getDigest().toUpperCase()} ${this.accessKey}:${signature}`
  }

  canonicalString () {
    return [
      this.getMethod(),
      this.headers.get('content-type'),
      this.headers.get('content-md5'),
      this.getPathAndQuery(),
      this.headers.get('date')
    ].join(',')
  }

  getBody () {
    if (!this.hasBody()) { return null }

    let body = this.body || ''
    if (!isString(body)) {
      body = JSON.stringify(body)
    }

    return body
  }

  getDigest () {
    return this.digest || 'sha1'
  }

  getMethod () {
    return this.method.toUpperCase()
  }

  getPathAndQuery () {
    return (this.url.pathname + this.url.search)
  }

  getOptions () {
    const options = {
      method: this.getMethod(),
      headers: this.headers
    }

    if (this.hasBody()) {
      options.body = this.getBody()
    }

    return Object.assign({}, this.options, options)
  }

  hasBody () {
    return ['GET', 'HEAD'].indexOf(this.getMethod()) === -1
  }

  setContentMd5 () {
    this.headers.delete('content-md5')
    if (!this.hasBody()) { return this }

    const md5Checksum = md5Base64digest(this.getBody())
    this.headers.set('content-md5', md5Checksum)
    return this
  }

  sign () {
    if (!this.accessKey || !this.secretKey) { return this }

    const timestamp = new Date()

    this.setContentMd5()
    this.headers.set('date', timestamp.toUTCString())
    this.headers.set('authorization', this.authorizationHeader())

    return this
  }
}

function signedFetch (url, options = {}) {
  const signedRequestOptions = Object.assign({ url: url }, options)
  const signedRequest = new SignedRequest(signedRequestOptions)

  return signedRequest.fetch()
}

module.exports = signedFetch
