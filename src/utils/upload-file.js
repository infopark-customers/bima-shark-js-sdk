'use strict'

const { simpleFetch } = require('./simple-fetch')

module.exports.uploadFileBrowser = (parameters = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', parameters.uploadUrl)
    xhr.setRequestHeader('Content-Type', parameters.fileMimeType || '')
    xhr.onprogress = parameters.onProgress
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response)
      } else {
          reject(xhr.statusText)
      }
    }
    xhr.send(parameters.file)
  })
}

module.exports.uploadFileNode = (parameters = {}) => {
  return simpleFetch(parameters.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': parameters.fileMimeType || ''
    },
    body: parameters.file
  })
}
