'use strict'

/*
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
function SharkError (status, message, json, fileName, lineNumber) {
  var instance = new Error(message, fileName, lineNumber)
  instance.status = status
  instance.json = json
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
  return instance
}

SharkError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(SharkError, Error)
}

export default SharkError
