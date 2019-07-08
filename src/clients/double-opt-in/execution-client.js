'use strict'

const Client = require('../base-client')

class DoubleOptInExecutionClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'DoubleOptInExecutionClient',
      url: `${url}/executions`,
      serviceToken: options.serviceToken
    })
  }

  verify (verificationToken) {
    return this.client.post(`${verificationToken}/verify`)
  }

  find (verificationToken) {
    return this.client.get(verificationToken)
  }

  terminate (verificationToken) {
    return this.client.delete(verificationToken)
  }
}

module.exports = DoubleOptInExecutionClient
