'use strict'

const Error = require('../jsonapi-serializer/error')
const Logger = require('../logger')

function jsonApiError (response) {
  const json = response.json
  let errors = []

  if (json && Array.isArray(json.errors)) {
    errors = json.errors
  } else {
    // This handles "legacy" errors from our services that haven't changed to
    // JSONAPI-compliant errors yet.
    let errorDetails = []
    if (json && json.messages) {
      errorDetails = json.messages
    } else if (json && json.message) {
      errorDetails = [json.message]
    } else {
      Logger.log('Unhandled response type: ', response)
      errorDetails = ['Unhandled error']
    }
    errors = errorDetails.map(detail => {
      return { status: response.status, title: response.statusText, detail }
    })
  }

  return new Error(errors)
}

module.exports = {
  jsonApiError
}
