'use strict'

const Client = require('./base-client')

class ConsentChangesClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ConsentChangesClient',
      url: `${url}/consents`,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      doorkeeperBaseUrl: options.doorkeeperBaseUrl,
      contentType: 'application/vnd.api+json'
    })
  }

  find (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/changes`)
  }
}

module.exports = ConsentChangesClient
