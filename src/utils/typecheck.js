'use strict'

function isArray (value) {
  return Array.isArray(value)
}

function isFunction (value) {
  return typeof value === 'function'
}

function isObject (value) {
  return value !== null && typeof value === 'object'
}

function isString (value) {
  return typeof value === 'string' || value instanceof String
}

module.exports = {
  isArray,
  isFunction,
  isObject,
  isString
}
