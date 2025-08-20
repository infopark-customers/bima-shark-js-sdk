'use strict'

const Client = require('./base-client')

class ContactListClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ContactListClient',
      url: `${url}/api/contact_lists`,
      serviceToken: options.serviceToken,
      getAuthToken: options.getAuthToken
    })
  }

  /** Fetch contacts that match this ContactList’s saved Elasticsearch query. */
  contacts (parameters = {}) {
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

module.exports = ContactListClient
