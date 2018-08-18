'use strict'

export function isArray (value) {
  return Array.isArray(value)
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isObject (value) {
  return value !== null && typeof value === 'object'
}

export function isString (value) {
  return typeof value === 'string' || value instanceof String
}

export default {
  isArray,
  isFunction,
  isObject,
  isString
}
