'use strict'

const Client = require('./base-client')

class PermissionClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'PermissionClient',
      url: `${url}/api/permissions`,
      serviceToken: options.serviceToken
    })
  }

  find (id, parameters = {}) {
    return this.client.find(id, parameters)
  }

  edit (id, parameters = {}) {
    return this.client.get(`${id}/edit`, parameters)
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

module.exports = PermissionClient
