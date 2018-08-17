'use strict'

const Config = require('./shark/config')
const Client = require('./shark/client')
const SharkError = require('./shark/error')

const NodeServiceTokenClient = require('./shark/service_token/node_client')
const BrowserServiceTokenClient = require('./shark/service_token/browser_client')
const NotificationsClient = require('./shark/clients/notifications_client')
const ConsentClient = require('./shark/clients/consent_client')
const ConsentChangesClient = require('./shark/clients/consent_changes_client')
const ActivityClient = require('./shark/clients/activity_client')

const ServiceTokenClient = Config.nodeProcess ? NodeServiceTokenClient : BrowserServiceTokenClient

/*
 * @class Shark
 * @classdesc Namespace for REST client and configuration.
 *
 */
const Shark = {
  Client: Client,
  Error: SharkError,

  ConsentClient: ConsentClient,
  ConsentChangesClient: ConsentChangesClient,
  NotificationsClient: NotificationsClient,
  ServiceTokenClient: ServiceTokenClient,
  ActivityClient: ActivityClient,

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
    ServiceTokenClient.reset()
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

module.exports = Shark
