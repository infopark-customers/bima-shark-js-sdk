'use strict'

import Config from 'src/shark/config'
import Client from 'src/shark/client'
import ServiceToken from 'src/shark/service_token'

import ClientError from 'src/shark/client_error'
import ServerError from 'src/shark/server_error'

import NotificationsClient from 'src/shark/clients/notifications_client'
import ConsentServiceClient from 'src/shark/clients/consentservice_client'

/*
 * @class Shark
 * @classdesc Namespace for REST client and configuration.
 *
 */
const Shark = {
  Client: Client,
  ServiceToken: ServiceToken,

  ClientError: ClientError,
  ServerError: ServerError,

  NotificationsClient: NotificationsClient,
  ConsentServiceClient: ConsentServiceClient,

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
  createClient: function (options) {
    return new Client(options)
  }
}

export {
  Client,
  ServiceToken,
  ClientError,
  ServerError,
  NotificationsClient,
  ConsentServiceClient
}

export default Shark
