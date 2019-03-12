'use strict'

const Client = require('./base-client')

class UserClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'UserClient',
      url: `${url}/api/users`,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      doorkeeperBaseUrl: options.doorkeeperBaseUrl,
      contentType: 'application/vnd.api+json'
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

module.exports = UserClient
