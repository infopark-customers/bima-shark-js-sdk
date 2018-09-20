'use strict'

const uploadFileBrowser = (options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', options.uploadUrl)
    xhr.setRequestHeader('Content-Type', options.fileMimeType || '')
    xhr.responseType = 'json'
    xhr.onprogress = options.onProgress
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr.statusText)
      }
    }
    xhr.send(options.file)
  })
}

module.exports = uploadFileBrowser
