'use strict'

const Client = require('./client')

class ConsentChangesClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ConsentChangesClient',
      url: `${url}/consents`,
      serviceTokenClient: options.serviceTokenClient
    })
  }

  find (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/changes`)
  }
}

module.exports = ConsentChangesClient
