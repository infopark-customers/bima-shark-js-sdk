'use strict'

const Client = require('./base-client')

class GroupClient {
  constructor (url) {
    this.client = new Client({
      name: 'GroupClient',
      url: `${url}/api/groups`
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
}

module.exports = GroupClient
