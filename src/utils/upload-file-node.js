'use strict'

const { simpleFetch } = require('./simple-fetch')

module.exports.uploadFileNode = (options = {}) => {
  return simpleFetch(options.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': options.fileMimeType || ''
    },
    body: options.file
  })
}
