'use strict'

const { jsonApiError } = require('./simple-fetch')

const uploadFileBrowser = (options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', options.uploadUrl)
    xhr.setRequestHeader('Content-Type', options.fileMimeType || '')
    xhr.responseType = 'json'
    xhr.upload.onprogress = options.onProgress
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        const error = jsonApiError(xhr)
        return reject(error)
      }
    }
    xhr.send(options.file)
  })
}

module.exports = uploadFileBrowser
