'use strict'

const Client = require('./base-client')

class NickClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'NickClient',
      url: `${url}`,
      serviceToken: options.serviceToken
    })
  }

  index (type, parameters = {}) {
    return this.client.get(type, parameters)
  }

  find (type, id, parameters = {}) {
    return this.client.get(`${type}/${id}`, parameters)
  }

  create (type, data, parameters = {}) {
    return this.client.post(type, data, parameters)
  }

  update (type, id, data, parameters = {}) {
    return this.client.put(`${type}/${id}`, data, parameters)
  }

  destroy (type, id, parameters = {}) {
    return this.client.delete(`${type}/${id}`, parameters)
  }
}

module.exports = NickClient
