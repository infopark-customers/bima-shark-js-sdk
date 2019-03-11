'use strict'

const Client = require('./base-client')

class AppClient {
  constructor (url) {
    this.client = new Client({
      name: 'AppsClient',
      url: url
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }
}

module.exports = AppClient
