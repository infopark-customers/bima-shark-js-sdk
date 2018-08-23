'use strict'

const Config = require('./config')

function debugLog () {
  if (Config.debug) {
    log.apply(null, arguments)
  }
}

function log () {
  const args = Array.from(arguments)
  args.unshift('[Shark]')
  console.log.apply(null, args)
}

module.exports = {
  debugLog: debugLog,
  log: log
}
