'use strict'

const Client = require('../base-client')

class DoubleOptInRequestClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'DoubleOptInRequestClient',
      url: `${url}/requests`,
      serviceToken: options.serviceToken
    })
  }

  create (data) {
    return this.client.create(data)
  }
}

module.exports = DoubleOptInRequestClient
