'use strict'

const Client = require('./base-client')
const simpleFetch = require('../utils/simple-fetch')
const mime = require('mime-types')

class AssetClient {
  constructor (url) {
    this.client = new Client({
      name: 'AssetClient',
      url: `${url}/assets`,
      contentType: 'application/vnd.api+json'
    })
  }

  create (params) {
    return this.__createOrUpdate('POST', `${this.client.baseUrl}`, params)
  }

  destroy (id, parameters = {}) {
    return this.client.destroy(id, parameters)
  }

  search (parameters = {}) {
    return this.client.search(parameters)
  }

  find (id, parameters = {}) {
    return this.client.find(id, parameters)
  }

  update (params) {
    return this.__createOrUpdate('PUT', `${this.client.baseUrl}/${params.id}`, params)
  }

  download (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/download`)
  }

  display (id) {
    return this.client.sendRequest(`${this.client.baseUrl}/${id}/inline`)
  }

  __createOrUpdate (method, url, params) {
    const data = params.data
    const file = params.file

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
