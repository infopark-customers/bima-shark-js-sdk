'use strict'

const Client = require('./base-client')

class AppClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'AppsClient',
      url: url,
      serviceTokenClient: options.serviceTokenClient
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }
}

module.exports = AppClient
