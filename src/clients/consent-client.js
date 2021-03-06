'use strict'

const Client = require('./base-client')

class ConsentClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ConsentClient',
      url: `${url}/consents`,
      serviceToken: options.serviceToken
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

module.exports = ConsentClient
