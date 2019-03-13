'use strict'

const Client = require('./base-client')

class DescriptionClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'DescriptionClient',
      url: `${url}/api/descriptions`,
      serviceToken: options.serviceToken
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }

  find (modelClass, parameters = {}) {
    return this.client.find(modelClass, parameters)
  }
}

module.exports = DescriptionClient
