'use strict'

const Client = require('./base-browser-client')

class DescriptionClient {
  constructor (url) {
    this.client = new Client({
      name: 'DescriptionClient',
      url: `${url}/api/descriptions`,
      contentType: 'application/vnd.api+json'
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
