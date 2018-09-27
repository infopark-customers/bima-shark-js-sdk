'use strict'

const Client = require('./base-client')
const { uploadFile } = require('../utils/shark-upload-file')
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

  create (file, options = {}) {
    return this.__createOrUpdate({
      method: 'POST',
      url: `${this.client.baseUrl}`,
      file: file,
      onProgress: options.onProgress,
      doAbort: options.doAbort
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

  update (file, id, options = {}) {
    return this.__createOrUpdate({
      method: 'PUT',
      url: `${this.client.baseUrl}/${id}`,
      file: file,
      onProgress: options.onProgress,
      doAbort: options.doAbort
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

  __createOrUpdate (options = {}) {
    const fileName = options.file.name
    const data = {
      data: {
        type: 'assets',
        attributes: {
          filename: fileName,
          directory: this.directory
        }
      }
    }

    return this.client.sendRequest(options.url, {
      method: options.method,
      body: data
    }).then(response => {
      const id = response.data.id
      const uploadUrl = response.data.links.upload
      const fileMimeType = mime.getType(fileName)

      return uploadFile({
        uploadUrl: uploadUrl,
        fileMimeType: fileMimeType,
        file: options.file,
        onProgress: options.onProgress,
        doAbort: options.doAbort
      }).then(() => {
        return this.find(id).then(asset => {
          return asset
        })
      })
    })
  }
}

module.exports = AssetClient
