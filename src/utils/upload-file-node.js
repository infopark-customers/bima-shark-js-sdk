'use strict'

const simpleFetch = require('./simple-fetch')
const { Headers } = require('./shark-fetch')

const uploadFileNode = (options = {}) => {
  const headers = new Headers()

  headers.set('Content-Type', options.fileMimeType || '')

  return simpleFetch(options.uploadUrl, {
    method: 'PUT',
    headers: headers,
    body: options.file
  })
}

module.exports = uploadFileNode
