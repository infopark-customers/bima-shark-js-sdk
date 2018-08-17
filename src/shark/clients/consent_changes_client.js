'use strict'

const Client = require('../client')

class ConsentChangesClient {
  constructor (url) {
    this.client = new Client({
      name: 'ConsentChangesClient',
      url: `${url}/consents`,
      contentType: 'application/vnd.api+json'
    })
  }

  find (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/changes`)
  }
}

module.exports = ConsentChangesClient
