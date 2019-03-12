'use strict'

const Client = require('./base-client')

class NotificationsClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'NotificationsClient',
      url: `${url}/notifications`,
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

  markAsRead (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}`, {
      method: 'PATCH'
    })
  }

  markAllAsRead () {
    return this.client.sendRequest(`${this.client.baseUrl}/read_all`, {
      method: 'PATCH'
    })
  }

  destroy (id) {
    return this.client.destroy(id)
  }
}

module.exports = NotificationsClient
