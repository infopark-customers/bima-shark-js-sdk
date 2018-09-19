'use strict'

const Client = require('./base-client')
const uploadFile = require('../utils/shark-upload-file')
const mime = require('mime/lite')

class AssetClient {
  constructor (url, directory) {
    this.client = new Client({
      name: 'AssetClient',
      url: `${url}/assets`,
      contentType: 'application/vnd.api+json'
    })
    this.directory = directory
  }

  create (file, parameters = {}) {
    return this.__createOrUpdate({
      method: 'POST',
      url: `${this.client.baseUrl}`,
      file: file,
      onProgress: parameters.onProgress
    })
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

  update (file, id, parameters = {}) {
    return this.__createOrUpdate({
      method: 'PUT',
      url: `${this.client.baseUrl}/${id}`,
      file: file,
      onProgress: parameters.onProgress
    })
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

  __createOrUpdate (parameters = {}) {
    const fileName = parameters.file.name
    const data = {
      data: {
        type: 'assets',
        attributes: {
          filename: fileName,
          directory: this.directory
        }
      }
    }

    return this.client.sendRequest(parameters.url, {
      method: parameters.method,
      body: data
    }).then(response => {
      const id = response.data.id
      const uploadUrl = response.data.links.upload
      const fileMimeType = mime.getType(fileName)

      return uploadFile({
        uploadUrl: uploadUrl,
        fileMimeType: fileMimeType,
        file: parameters.file,
        onProgress: parameters.onProgress
      }).then(() => {
        return this.find(id).then(asset => {
          return asset
        })
      })
    })
  }
}

module.exports = AssetClient
