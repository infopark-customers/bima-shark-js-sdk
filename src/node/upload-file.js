'use strict'

const sharkFetch = require('../utils/shark-fetch')
const { Headers } = require('../proxy')

function uploadFileNode (options = {}) {
  const headers = new Headers()

  headers.set('content-type', options.fileMimeType || '')

  return sharkFetch(options.uploadUrl, {
    method: 'PUT',
    headers: headers,
    body: options.file
  })
}

module.exports = uploadFileNode
