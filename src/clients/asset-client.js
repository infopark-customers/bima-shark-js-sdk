'use strict'

const Client = require('./base-client')
const simpleFetch = require('../utils/simple-fetch')
const mime = require('mime-types')

class AssetClient {
  constructor (url, directory) {
    this.client = new Client({
      name: 'AssetClient',
      url: `${url}/assets`,
      contentType: 'application/vnd.api+json'
    })
    this.directory = directory
  }

  create (file) {
    return this.__createOrUpdate('POST', `${this.client.baseUrl}`, file)
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

  update (file, id) {
    return this.__createOrUpdate('PUT', `${this.client.baseUrl}/${id}`, file)
  }

  getTemporaryDownloadUrl (id) {
    return this.find(id).then(asset => {
      return asset.data.links.download
    })
  }

  getTemporaryDisplayUrl (id) {
    return this.find(id).then(asset => {
      return asset.data.links.show
    })
  }

  __createOrUpdate (method, url, file) {
    const data = {
      data: {
        type: 'assets',
        attributes: {
          filename: file.name,
          directory: this.directory
        }
      }
    }

    return this.client.sendRequest(url, {
      method: method,
      body: data
    }).then(response => {
      const id = response.data.id
      const uploadUrl = response.data.links.upload
      const fileMimeType = mime.lookup(file)

      return simpleFetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileMimeType || ''
        },
        body: file
      }).then(() => {
        return this.find(id).then(asset => {
          return asset
        })
      })
    })
  }
}

module.exports = AssetClient
