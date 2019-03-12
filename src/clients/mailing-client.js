'use strict'

const Client = require('./base-client')

class MailingClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'MailingClient',
      url: `${url}/v1/mails`,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      doorkeeperBaseUrl: options.doorkeeperBaseUrl,
      contentType: 'application/vnd.api+json'
    })
  }

  create (data) {
    return this.client.create(data)
  }
}

module.exports = MailingClient
