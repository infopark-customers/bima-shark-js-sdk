'use strict'

const Client = require('./base-browser-client')

class SubscriptionClient {
  constructor (url) {
    this.client = new Client({
      name: 'SubscriptionClient',
      url: `${url}/subscriptions`,
      contentType: 'application/vnd.api+json'
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }

  create (data, parameters = {}) {
    return this.client.create(data, parameters)
  }

  destroy (id, parameters = {}) {
    return this.client.destroy(id, parameters)
  }

  bulkCreate (data) {
    return this.__bulkOperation(`${this.client.baseUrl}/bulk_creation`, data)
  }

  bulkDelete (data) {
    return this.__bulkOperation(`${this.client.baseUrl}/bulk_deletion`, data)
  }

  __bulkOperation (url, data) {
    return this.client.sendRequest(url, {
      body: data,
      method: 'POST'
    })
  }
}

module.exports = SubscriptionClient
