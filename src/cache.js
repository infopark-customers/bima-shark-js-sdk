'use strict'

/**
 * @class Cache
 * @classdesc Helper class to cache some values.
 */
class Cache {
  constructor () {
    this.data = {}
  }

  empty () {
    this.data = {}
  }

  lookup (key) {
    return this.data[key]
  }

  store (key, value) {
    this.data[key] = value
    return value
  }

  remove (key) {
    delete this.data[key]
  }
}

module.exports = new Cache()
