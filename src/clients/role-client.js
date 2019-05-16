'use strict'

const Client = require('./base-client')

class RoleClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'RoleClient',
      url: `${url}/api/roles`,
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
    return this.client.patch(id, data, parameters)
  }

  destroy (id, parameters = {}) {
    return this.client.destroy(id, parameters)
  }

  describe (parameters = {}) {
    return this.client.get('describe', parameters)
  }
}

module.exports = RoleClient
