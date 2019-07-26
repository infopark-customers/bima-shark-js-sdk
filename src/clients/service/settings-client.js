'use strict'

const Client = require('../base-client')

class ServiceSettingsClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'ServiceSettingsClient',
      url: `${url}/api/settings`,
      serviceToken: options.serviceToken
    })
  }

  find () {
    return this.client.get('1')
  }
}

module.exports = ServiceSettingsClient
