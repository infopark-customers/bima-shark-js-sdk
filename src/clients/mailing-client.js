'use strict'

const Client = require('./base-client')

class MailingClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'MailingClient',
      url: `${url}/v1/mails`,
      serviceToken: options.serviceToken
    })
  }

  create (data) {
    return this.client.create(data)
  }
}

module.exports = MailingClient
