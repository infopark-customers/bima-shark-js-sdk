'use strict'

module.exports.isArray = (value) => {
  return Array.isArray(value)
}

module.exports.isFunction = (value) => {
  return typeof value === 'function'
}

module.exports.isObject = (value) => {
  return value !== null && typeof value === 'object'
}

module.exports.isString = (value) => {
  return typeof value === 'string' || value instanceof String
}
