'use strict'

const Cache = require('./cache')
const Config = require('./config')
const Logger = require('./logger')
const SharkError = require('./error')

/*
 * @class Shark
 * @classdesc Namespace for REST clients and configuration.
 *
 */
const Shark = {
  Error: SharkError,

  /**
   * Returns the Shark configuration
   *
   * @return {Object}         The Shark configuration
   */
  config: Config,

  /**
   * Merge the options into the Shark configuration.
   * Empties the cache.
   *
   * @param  {object} [options] The options we want to pass
   */
  configure: (options) => {
    Cache.empty()
    Object.assign(Shark.config, options)
  },

  /**
   * Returns the Shark logging method
   */
  log: Logger.log
}

module.exports = Shark
