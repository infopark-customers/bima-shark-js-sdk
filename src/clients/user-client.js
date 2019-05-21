'use strict'

const Client = require('./base-client')

class UserClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'UserClient',
      url: `${url}/api/users`,
      serviceToken: options.serviceToken
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

  getBusinessApps (id, parameters = {}) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/business_apps`, {
      method: 'GET'
    })
  }
}

module.exports = UserClient
