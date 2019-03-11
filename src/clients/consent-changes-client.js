'use strict'

const Client = require('./base-client')

class ConsentChangesClient {
  constructor (url) {
    this.client = new Client({
      name: 'ConsentChangesClient',
      url: `${url}/consents`
    })
  }

  find (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/changes`)
  }
}

module.exports = ConsentChangesClient
