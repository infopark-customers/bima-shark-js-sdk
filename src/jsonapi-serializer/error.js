'use strict'

function ErrorDocument (errors) {
  var jsonapi = {
    errors: []
  }

  errors.forEach(function (error) {
    var opts = {}

    if (error.id) { opts.id = error.id }
    if (error.status) { opts.status = error.status }
    if (error.code) { opts.code = error.code }
    if (error.title) { opts.title = error.title }
    if (error.detail) { opts.detail = error.detail }

    if (error.source) {
      opts.source = {}

      if (error.source.pointer) {
        opts.source.pointer = error.source.pointer
      }

      if (error.source.parameter) {
        opts.source.parameter = error.source.parameter
      }
    }

    if (error.links) {
      opts.links = { about: error.links.about }
    }

    if (error.meta) {
      opts.meta = error.meta
    }

    jsonapi.errors.push(opts)
  })

  return jsonapi
}

module.exports = function (opts) {
  if (!opts) { opts = [] }

  if (Array.isArray(opts)) {
    return new ErrorDocument(opts)
  } else {
    return new ErrorDocument([opts])
  }
}
