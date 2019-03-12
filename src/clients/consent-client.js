'use strict'

const Client = require('./base-client')

class ConsentClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ConsentClient',
      url: `${url}/consents`,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      doorkeeperBaseUrl: options.doorkeeperBaseUrl,
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

module.exports = ConsentClient
