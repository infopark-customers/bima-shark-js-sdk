'use strict'

const Client = require('./base-client')

class AppClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'AppsClient',
      url: url,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      doorkeeperBaseUrl: options.doorkeeperBaseUrl,
      contentType: 'application/vnd.api+json'
    })
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }
}

module.exports = AppClient
