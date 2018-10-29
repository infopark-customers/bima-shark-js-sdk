'use strict'

const Client = require('./base-client')
const { uploadFile } = require('../utils/shark-upload-file')
const mime = require('mime/lite')

/**
 * @class AssetClient
 * @classdesc Asset Service client.
 */
class AssetClient {
  constructor (url, directory) {
    this.client = new Client({
      name: 'AssetClient',
      url: `${url}/assets`,
      contentType: 'application/vnd.api+json'
    })
    this.directory = directory
  }

  /**
   *
   * @param {File} file A file object.
   * @param {Object} options An options object allowing to specify onProgress and doCancel functions.
   * onProgress handles upload progress in app utilizing this client. doCancel function returning true/false indicating the need to abort upload.
   *
   * @return {Promise} The request promise.
   */
  create (file, options = {}) {
    return this.__createOrUpdate({
      method: 'POST',
      url: `${this.client.baseUrl}`,
      file: file,
      onProgress: options.onProgress,
      doCancel: options.doCancel,
      versions: options.versions
    })
  }

  /**
   *
   * @param {String} id An id of asset to destroy.
   * @param {Object} parameters Optional url parameters.
   *
   * @return {Promise} The request promise.
   */
  destroy (id, parameters = {}) {
    return this.client.destroy(id, parameters)
  }

  /**
   *
   * @param {Object} parameters Optional filter parameters.
   *
   * @return {Promise} The request promise.
   */
  search (parameters = {}) {
    return this.client.search(parameters)
  }

  /**
   *
   * @param {String} id An id of asset to find.
   * @param {Object} parameters Optional url parameters.
   *
   * @return {Promise} The request promise.
   */
  find (id, parameters = {}) {
    return this.client.find(id, parameters)
  }

  /**
   *
   * @param {File} file A file object.
   * @param {String} id An id of asset to update.
   * @param {Object} options An options object allowing to specify onProgress and doCancel functions.
   * onProgress handles upload progress in app utilizing this client. doCancel function returning true/false indicating the need to abort upload.
   *
   * @return {Promise} The request promise.
   */
  update (file, id, options = {}) {
    return this.__createOrUpdate({
      method: 'PUT',
      url: `${this.client.baseUrl}/${id}`,
      file: file,
      onProgress: options.onProgress,
      doCancel: options.doCancel,
      versions: options.versions
    })
  }

  /**
   *
   * @param {String} id An id of asset to get the temporary download url of.
   *
   * @return {Promise} A promise that resolves to a temporary asset download url.
   */
  getTemporaryDownloadUrl (id) {
    return this.find(id).then(asset => {
      return asset.data.links.download
    })
  }

  /**
   *
   * @param {String} id An id of asset to get the temporary show url of.
   *
   * @return {Promise} A promise that resolves to a temporary asset show url.
   */
  getTemporaryDisplayUrl (id) {
    return this.find(id).then(asset => {
      return asset.data.links.show
    })
  }

  __createOrUpdate (options = {}) {
    const fileName = options.file.name
    const versions = options.versions

    const data = {
      data: {
        type: 'assets',
        attributes: {
          filename: fileName,
          directory: this.directory,
          versions: versions
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
        doCancel: options.doCancel,
        versions: options.versions
      }).then(() => {
        return this.find(id).then(asset => {
          return asset
        })
      })
    })
  }
}

module.exports = AssetClient
