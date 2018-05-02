'use strict'

import 'whatwg-fetch'

import Config from 'src/shark/config'
import Client from 'src/shark/client'
import ServiceToken from 'src/shark/service_token'

/*
 * @class Shark
 * @classdesc Namespace for REST client and configuration.
 *
 */
const Shark = {
  Client: Client,
  ServiceToken: ServiceToken,

  /**
   * Returns the Shark configuration
   *
   * @return {Object}         The Shark configuration
   */
  config: Config,

  /**
   * Merge the options into the Shark configuration
   *
   * @param  {object} [options] The options we want to pass
   */
  configure: function (options) {
    Object.assign(Shark.config, options)
  },

  /**
   * Merge the options into the Shark configuration
   *
   * @param  {object} [options] The options we want to pass
   *
   * @return {Client}           A basic Shark client
   */
  createClient: function (options) {
    return new Client(options)
  }
}

export { Client, ServiceToken }

export default Shark
