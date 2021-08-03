'use strict'

const { jsonApiError } = require('../utils/response-helper')
const { isFunction } = require('../utils/typecheck')

function uploadFileBrowser (options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('PUT', options.uploadUrl)
    if (options.fileMimeType) {
      xhr.setRequestHeader('Content-Type', options.fileMimeType)
    }
    if (options.authorization) {
      xhr.setRequestHeader('Authorization', options.authorization)
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
