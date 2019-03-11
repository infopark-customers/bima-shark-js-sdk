'use strict'

const Client = require('./client')

class DescriptionClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'DescriptionClient',
      url: `${url}/api/descriptions`,
      serviceTokenClient: options.serviceTokenClient
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
