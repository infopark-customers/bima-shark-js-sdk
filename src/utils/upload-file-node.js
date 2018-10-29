'use strict'

const { simpleFetch } = require('./simple-fetch')

const uploadFileNode = (options = {}) => {
  const metadataHeader = 'x-amz-meta-'
  const versions = options.versions
  const headers = new Headers()

  headers.set('Content-Type', options.fileMimeType || '')

  if (typeof versions !== 'undefined') {
    Object.keys(versions).forEach(name => {
      headers.set(`${metadataHeader}${name}`, versions[name])
    })
  }

  return simpleFetch(options.uploadUrl, {
    method: 'PUT',
    headers: headers,
    body: options.file
  })
}

module.exports = uploadFileNode
