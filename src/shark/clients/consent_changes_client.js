'use strict'

import Client from 'src/shark/client'

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

export default ConsentChangesClient
