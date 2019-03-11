'use strict'

const Client = require('./client')

class ActivityClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ActivityClient',
      url: `${url}/api/activities`,
      serviceTokenClient: options.serviceTokenClient
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }

  find (id, parameters = {}) {
    return this.client.find(id, parameters)
  }

  create (data, parameters = {}) {
    return this.client.create(data, parameters)
  }

  update (id, data, parameters = {}) {
    return this.client.update(id, data, parameters)
  }

  destroy (id, parameters = {}) {
    return this.client.destroy(id, parameters)
  }
}

module.exports = ActivityClient
