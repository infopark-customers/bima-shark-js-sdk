'use strict'

import Client from 'src/shark/client'

class ConsentServiceClient {
  constructor (url) {
    this.client = new Client({
      name: 'ConsentServiceClient',
      url: `${url}/consents`,
      contentType: 'application/vnd.api+json'
    })
  }

  search () {
    return this.client.search()
  }

  find (id) {
    return this.client.find(id)
  }

  create (data) {
    return this.client.create(data)
  }

  update (id, data) {
    return this.client.update(id, data)
  }
}

export default ConsentServiceClient
