'use strict'

const { jsonApiError } = require('./response-helper')
const { isFunction } = require('./typecheck')
const isEmpty = require('is-empty')

const uploadFileBrowser = (options = {}) => {
  const metadataHeader = 'x-amz-meta-variation-'
  const variations = options.variations

  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('PUT', options.uploadUrl)
    xhr.setRequestHeader('Content-Type', options.fileMimeType || '')

    if (!isEmpty(variations)) {
      variations.forEach(variation => {
        const name = Object.keys(variation)[0]
        xhr.setRequestHeader(`${metadataHeader}${name}`, variation[name])
      })
    }

    xhr.responseType = 'json'
    xhr.upload.onprogress = (e) => {
      if (isFunction(options.doCancel) && options.doCancel()) {
        xhr.abort()
        return
      }
      if (isFunction(options.onProgress)) {
        options.onProgress(e)
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        return resolve(xhr.response)
      } else {
        const error = jsonApiError(xhr)
        return reject(error)
      }
    }
    xhr.send(options.file)
  })
}

module.exports = uploadFileBrowser
