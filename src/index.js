'use strict'

import Config from 'src/shark/config'
import Client from 'src/shark/client'

import BrowserServiceTokenClient from 'src/shark/service_token/node_client'
import NodeServiceTokenClient from 'src/shark/service_token/browser_client'

import SharkError from 'src/shark/error'

const ServiceToken = Config.nodeProcess ? NodeServiceTokenClient : BrowserServiceTokenClient

/*
 * @class Shark
 * @classdesc Namespace for REST client and configuration.
 *
 */
const Shark = {
  Client: Client,
  ServiceToken: ServiceToken,
  Error: SharkError,

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
  configure: (options) => {
    ServiceToken.reset()
    Object.assign(Shark.config, options)
  },

  /**
   * Merge the options into the Shark configuration
   *
   * @param  {object} [options] The options we want to pass
   *
   * @return {Client}           A basic Shark client
   */
  createClient: (options) => {
    return new Client(options)
  }
}

export {
  Client,
  ServiceToken,
  SharkError
}

export default Shark
