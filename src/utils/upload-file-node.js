'use strict'

const simpleFetch = require('./simple-fetch')
const { Headers } = require('../proxy')

const uploadFileNode = (options = {}) => {
  const headers = new Headers()

  headers.set('content-type', options.fileMimeType || '')

  return simpleFetch(options.uploadUrl, {
    method: 'PUT',
    headers: headers,
    body: options.file
  })
}

module.exports = uploadFileNode
