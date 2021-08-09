'use strict'

const Client = require('./base-client')
const { uploadFile } = require('../proxy')

class ContactClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ContactClient',
      url: `${url}/api/contacts`,
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

  uploadAvatar (id, formData) {
    const options = {
      uploadUrl: `${this.client.baseUrl}/${id}/avatar`,
      file: formData
    }

    let promise

    if (this.client.authorizationRequired) {
      promise = this.client.tokenClient.createServiceToken({}).then(token => {
        options.authorization = `Bearer ${token.jwt}`
      })
    } else {
      promise = Promise.resolve()
    }

    return promise.then(_ => {
      return uploadFile(options)
    })
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
