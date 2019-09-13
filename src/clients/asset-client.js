'use strict'

const Client = require('./base-client')
const { uploadFile } = require('../proxy')
const mime = require('mime/lite')

/**
 * @class AssetClient
 * @classdesc Asset Service client.
 */
class AssetClient {
  constructor (url, directory, options = {}) {
    this.client = new Client({
      name: 'AssetClient',
      url: `${url}/assets`,
      serviceToken: options.serviceToken
    })
    this.directory = directory
  }

  /**
   * @example
   *  client.create(file, {
   *    onProgress: (?) => { console.log('in progress') },
   *    doCancel: (?) => { return (condition ? true : false) },
   *    formats: {
   *     marginal: {
   *        in: ['-resize', '230x'],
   *        ext: 'jpg'
   *     },
   *     common: {
   *        in: ['-resize', '2048>', '-strip', '-interlace', 'Plane', '-quality', '100'],
   *        ext: 'jpg'
   *     }
   *    }
   *  })
   * @param {File} file A file object.
   * @param {Object} options An options object allowing to specify onProgress and doCancel functions and formats for image assets.
   * onProgress handles upload progress in an app using this client.
   * doCancle function returning true/false indicating if upload should be cancelled.
   * formats define imagemagic transformation for image assets
   * @return {Promise} The request promise.
   */
  create (file, options = {}) {
    return this.__createOrUpdate({
      method: 'POST',
      url: `${this.client.baseUrl}`,
      file: file,
      onProgress: options.onProgress,
      doCancel: options.doCancel,
      formats: options.formats || {}
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
   * @example
   *  client.update(file, id, {
   *    onProgress: (?) => { console.log('in progress') },
   *    doCancel: (?) => { return (condition ? true : false) },
   *    formats: {
    *     marginal: {
    *        in: ['-resize', '230x'],
    *        ext: 'jpg'
    *     },
    *     common: {
    *        in: ['-resize', '2048>', '-strip', '-interlace', 'Plane', '-quality', '100'],
    *        ext: 'jpg'
    *     }
    *    }
   *  })
   * @param {File} file A file object.
   * @param {String} id An id of asset to update.
   * @param {Object} options An options object allowing to specify onProgress and doCancel functions and formats for image assets.
   * onProgress handles upload progress in an app using this client.
   * doCancle function returning true/false indicating if upload should be cancelled.
   * formats define imagemagic transformation for image assets
   * @return {Promise} The request promise.
   */
  update (file, id, options = {}) {
    return this.__createOrUpdate({
      method: 'PUT',
      url: `${this.client.baseUrl}/${id}`,
      file: file,
      onProgress: options.onProgress,
      doCancel: options.doCancel,
      formats: options.formats || {}
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
    const formats = options.formats

    const data = {
      data: {
        type: 'assets',
        attributes: {
          filename: fileName,
          directory: this.directory,
          formats: formats
        }
      }
    }

    return this.client.sendRequest(options.url, {
      method: options.method,
      body: data
    }).then(response => {
      const id = response.data.id
      const uploadUrl = response.data.links.upload
      // options.file.type is not enough because it might fail on Windows
      // https://stackoverflow.com/questions/32849014/ie-11-and-ie-edge-get-file-type-failed
      const fileMimeType = mime.getType(fileName)

      return uploadFile({
        uploadUrl: uploadUrl,
        fileMimeType: fileMimeType,
        file: options.file,
        onProgress: options.onProgress,
        doCancel: options.doCancel,
        formats: formats
      }).then(() => {
        return this.find(id).then(asset => {
          return asset
        })
      })
    })
  }
}

module.exports = AssetClient
