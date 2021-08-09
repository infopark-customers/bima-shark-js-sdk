'use strict'

const sharkFetch = require('../utils/shark-fetch')

function uploadFileNode (options = {}) {
  const file = options.file
  const headers = {}

  if (options.fileMimeType) {
    headers['content-type'] = options.fileMimeType
  }
  if (options.authorization) {
    headers.authorization = options.authorization
  }

  return sharkFetch(options.uploadUrl, {
    method: 'PUT',
    headers: headers,
    body: file.body
  })
}

module.exports = uploadFileNode
