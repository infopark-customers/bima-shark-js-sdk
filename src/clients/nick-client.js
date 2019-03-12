'use strict'

const { buildUrl } = require('../utils/url-helper')
const Client = require('./base-browser-client')

class NickClient {
  constructor (url) {
    this.client = new Client({
      name: 'NickClient',
      url: `${url}`,
      contentType: 'application/vnd.api+json'
    })
  }

  index (type, parameters = {}) {
    let url = buildUrl(this.client.baseUrl, type, parameters)
    return this.client.sendRequest(url, { method: 'GET' })
  }

  find (type, id, parameters = {}) {
    let url = buildUrl(this.client.baseUrl, `${type}/${id}`, parameters)
    return this.client.sendRequest(url, { method: 'GET' })
  }

  create (type, data, parameters = {}) {
    let url = buildUrl(this.client.baseUrl, type, parameters)
    return this.client.sendRequest(url, { body: data, method: 'POST' })
  }

  update (type, id, data, parameters = {}) {
    let url = buildUrl(this.client.baseUrl, `${type}/${id}`, parameters)
    return this.client.sendRequest(url, { body: data, method: 'PUT' })
  }

  destroy (type, id, parameters = {}) {
    let url = buildUrl(this.client.baseUrl, `${type}/${id}`, parameters)
    return this.sendRequest(url, { method: 'DELETE' })
  }
}

module.exports = NickClient
