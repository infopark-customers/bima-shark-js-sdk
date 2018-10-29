'use strict'

const { jsonApiError } = require('./simple-fetch')
const { isFunction } = require('./typecheck')

const uploadFileBrowser = (options = {}) => {
  const metadataHeader = 'x-amz-meta-'
  const versions = options.versions

  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('PUT', options.uploadUrl)
    xhr.setRequestHeader('Content-Type', options.fileMimeType || '')

    if (typeof versions !== 'undefined') {
      Object.keys(versions).forEach(name => {
        xhr.setRequestHeader(`${metadataHeader}${name}`, versions[name])
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
