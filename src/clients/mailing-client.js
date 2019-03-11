'use strict'

const Client = require('./base-client')

class MailingClient {
  constructor (url, options) {
    this.client = new Client({
      name: 'MailingClient',
      url: `${url}/v1/mails`,
      serviceTokenClient: options.serviceTokenClient
    })
  }

  create (data) {
    return this.client.create(data)
  }
}

module.exports = MailingClient
