'use strict'

const Cache = require('./cache')
const Config = require('./config')
const Logger = require('./logger')
const SharkError = require('./error')
const TypeCheck = require('./utils/typecheck')
const fetch = require('./utils/simple-fetch')

const Client = require('./clients/base-client')
const ActivityClient = require('./clients/activity-client')
const AppClient = require('./clients/app-client')
const AssetClient = require('./clients/asset-client')
const ConsentClient = require('./clients/consent-client')
const ConsentChangesClient = require('./clients/consent-changes-client')
const ContactClient = require('./clients/contact-client')
const DescriptionClient = require('./clients/description-client')
const DoubleOptInExecutionClient = require('./clients/double-opt-in/execution-client')
const DoubleOptInRequestClient = require('./clients/double-opt-in/request-client')
const GroupClient = require('./clients/group-client')
const MailingClient = require('./clients/mailing-client')
const NickClient = require('./clients/nick-client')
const NotificationsClient = require('./clients/notifications-client')
const PermissionClient = require('./clients/permission-client')
const RoleClient = require('./clients/role-client')
const SubscriptionClient = require('./clients/subscription-client')
const UserClient = require('./clients/user-client')

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
  log: Logger.log,

  isArray: TypeCheck.isArray,
  isFunction: TypeCheck.isFunction,
  isObject: TypeCheck.isObject,
  isString: TypeCheck.isString,

  fetch: fetch,

  Client,
  ActivityClient,
  AppClient,
  AssetClient,
  ConsentClient,
  ConsentChangesClient,
  ContactClient,
  DescriptionClient,
  DoubleOptInExecutionClient,
  DoubleOptInRequestClient,
  GroupClient,
  MailingClient,
  NickClient,
  NotificationsClient,
  PermissionClient,
  RoleClient,
  SubscriptionClient,
  UserClient
}

module.exports = Shark
