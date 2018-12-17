'use strict'

const isEmpty = require('is-empty')
const simpleFetch = require('./simple-fetch')
const { Headers } = require('./shark-fetch')

const uploadFileNode = (options = {}) => {
  const metadataHeader = 'x-amz-meta-variation-'
  const variations = options.variations
  const headers = new Headers()

  headers.set('Content-Type', options.fileMimeType || '')

  if (!isEmpty(variations)) {
    variations.forEach(variation => {
      const name = Object.keys(variation)[0]
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
