'use strict'

function imageUrl (url, version) {
  if (!url) {
    return null
  }

  return url.replace('/original?', `/${version}?`)
}

module.exports = imageUrl
