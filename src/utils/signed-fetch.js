'use strict'

const crypto = require('crypto')
const url = require('url')

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
    this.method = options.method.toUpperCase()

    this.headers = Object.assign({}, options.headers || {})

    this.url = new url.URL(options.url)

    this.body = options.body

    this.digest = options.digest || 'sha1'
    this.accessKey = options.accessKey
    this.secretKey = options.secretKey
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
    const signature = crypto.createHmac(this.digest, this.secretKey)
      .update(this.canonicalString())
      .digest('base64')

    return `APIAuth-HMAC-${this.digest.toUpperCase()} ${this.accessKey}:${signature}`
  }

  canonicalString () {
    return [
      this.method,
      this.headers['content-type'],
      this.headers['content-md5'],
      this.getPathAndQuery(),
      this.headers.date
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

  getPathAndQuery () {
    return (this.url.pathname + this.url.search)
  }

  getOptions () {
    const options = {
      method: this.method,
      headers: this.headers
    }

    if (this.hasBody()) {
      options.body = this.getBody()
    }

    return options
  }

  hasBody () {
    return ['GET', 'HEAD'].indexOf(this.method) === -1
  }

  getContentMd5 () {
    if (!this.hasBody()) { return this }

    return md5Base64digest(this.getBody())
  }

  sign () {
    if (!this.accessKey || !this.secretKey) { return this }

    const timestamp = new Date()

    this.headers['content-md5'] = this.getContentMd5()
    this.headers.date = timestamp.toUTCString()
    this.headers.authorization = this.authorizationHeader()

    return this
  }
}

function signedFetch (url, options = {}) {
  const signedRequestOptions = Object.assign({ url: url }, options)
  const signedRequest = new SignedRequest(signedRequestOptions)

  return signedRequest.fetch()
}

module.exports = signedFetch
