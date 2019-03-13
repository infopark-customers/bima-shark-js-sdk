'use strict'

const Client = require('./base-client')

class NotificationsClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'NotificationsClient',
      url: `${url}/notifications`,
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

  markAsRead (id) {
    return this.client.patch(id, {})
  }

  markAllAsRead () {
    return this.client.patch('read_all', {})
  }

  destroy (id) {
    return this.client.destroy(id)
  }
}

module.exports = NotificationsClient
