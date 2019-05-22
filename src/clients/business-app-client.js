'use strict'

const Client = require('./base-client')

class BusinessAppClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'BusinessAppClient',
      url: `${url}/api/business_apps`,
      serviceToken: options.serviceToken
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }

  find (id, parameters = {}) {
    return this.client.find(id, parameters)
  }
}

module.exports = BusinessAppClient
