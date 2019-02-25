'use strict'

const Client = require('./base-browser-client')

class NickClient {
  constructor (url) {
    this.client = new Client({
      name: 'NickClient',
      url: `${url}`,
      contentType: 'application/vnd.api+json'
    })
  }

  index (type) {
    let url = `${this.client.baseUrl}/${type}`
    return this.client.sendRequest(url, { method: 'GET' })
  }

  find (type, id) {
    let url = `${this.client.baseUrl}/${type}/${id}`
    return this.client.sendRequest(url, { method: 'GET' })
  }

  create (type, data) {
    let url = `${this.client.baseUrl}/${type}`
    return this.client.sendRequest(url, { body: data, method: 'POST' })
  }

  update (type, id, data) {
    let url = `${this.client.baseUrl}/${type}/${id}`
    return this.client.sendRequest(url, { body: data, method: 'PUT' })
  }

  destroy (type, id, parameters = {}) {
    let url = `${this.client.baseUrl}/${type}/${id}`
    return this.sendRequest(url, { method: 'DELETE' })
  }
}

module.exports = NickClient
