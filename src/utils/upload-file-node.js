'use strict'

const { simpleFetch } = require('./simple-fetch')
const isEmpty = require('is-empty')

const uploadFileNode = (options = {}) => {
  const metadataHeader = 'x-amz-meta-variation-'
  const variations = options.variations
  const headers = new Headers()

  headers.set('Content-Type', options.fileMimeType || '')

  if (!isEmpty(variations)) {
    Object.keys(variations).forEach(name => {
      headers.set(`${metadataHeader}${name}`, variations[name])
    })
  }

  return simpleFetch(options.uploadUrl, {
    method: 'PUT',
    headers: headers,
    body: options.file
  })
}

module.exports = uploadFileNode
