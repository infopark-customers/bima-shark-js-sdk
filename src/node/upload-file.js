'use strict'

const sharkFetch = require('../utils/shark-fetch')

function uploadFileNode (options = {}) {
  const file = options.file
  const type = options.fileMimeType || ''

  return sharkFetch(options.uploadUrl, {
    method: 'PUT',
    headers: {
      'content-type': type
    },
    body: file.body
  })
}

module.exports = uploadFileNode
