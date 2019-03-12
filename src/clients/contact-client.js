'use strict'

const Client = require('./base-client')

class ContactClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ContactClient',
      url: `${url}/api/contacts`,
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
    return this.client.patch(id, data, parameters)
  }

  destroy (id, parameters = {}) {
    return this.client.destroy(id, parameters)
  }

  uploadAvatar (id, data) {
    return this.client.uploadFile(`${id}/avatar`, data)
  }

  deleteAvatar (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/avatar`, {
      method: 'DELETE'
    })
  }

  toggleGravatar (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/toggle_gravatar`, {
      method: 'PUT'
    })
  }
}

module.exports = ContactClient
