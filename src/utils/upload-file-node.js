'use strict'

const simpleFetch = require('./simple-fetch')

const uploadFileNode = (options = {}) => {
  return simpleFetch(options.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': options.fileMimeType || ''
    },
    body: options.file
  })
}

module.exports = uploadFileNode
