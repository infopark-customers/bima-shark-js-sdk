'use strict'

const Client = require('../client')

class NotificationsClient {
  constructor (url) {
    this.client = new Client({
      name: 'NotificationsClient',
      url: `${url}/notifications`,
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
