'use strict'

const Client = require('./base-client')

class SubscriptionClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'SubscriptionClient',
      url: `${url}/subscriptions`,
      serviceToken: options.serviceToken
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
