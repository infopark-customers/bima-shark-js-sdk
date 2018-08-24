'use strict'

const Client = require('./base-client')
const simpleFetch = require('../utils/simple-fetch')
const mime = require('mime-types')

class AssetClient {
  constructor (url) {
    this.client = new Client({
      name: 'AssetClient',
      url: url,
      contentType: 'application/vnd.api+json'
    })
  }

  create (params) {
    return this.__createOrUpdate(params)
  }

  destroy (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/assets/${id}`, {
      method: 'DELETE'
    })
  }

  index () {
    return this.client.sendRequest(`${this.client.baseUrl}/assets`)
  }

  show (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/assets/${id}`)
  }

  update (params) {
    return this.__createOrUpdate(params)
  }

  download (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}`)
  }

  display (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/inline`)
  }

  __createOrUpdate (params) {
    const id = params.id
    const data = params.data
    const file = params.file

    const url = id ? `${this.client.baseUrl}/assets/${id}` : `${this.client.baseUrl}/assets`
    const method = id ? 'PUT' : 'POST'

    return this.client.sendRequest(url, {
      method: method,
      body: data
    }).then(response => {
      const uploadUrl = response.data.links.upload
      const fileMimeType = mime.lookup(file)

      return simpleFetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileMimeType || ''
        },
        body: file
      })
    })
  }
}

module.exports = AssetClient
