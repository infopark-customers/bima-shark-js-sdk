'use strict'

if (!window.fetch) {
  console.error('[Shark] No implementation of window.fetch found.')
  console.error('[Shark] Please add a polyfill like `whatwg-fetch`.')
}

/*
 * Configure proxy with Node.js implementation details
 */
const proxy = require('./src/proxy')

proxy.fetch = window.fetch
proxy.Headers = window.Headers
proxy.Request = window.Request
proxy.Response = window.Response

proxy.uploadFile = require('./src/utils/upload-file-browser')

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
const { isArray, isFunction, isObject, isString } = require('./src/utils/typecheck')

Shark.Client = require('./src/clients/base-browser-client')
Shark.ActivityClient = require('./src/clients/activity-client')
Shark.AppClient = require('./src/clients/app-client')
Shark.AssetClient = require('./src/clients/asset-client')
Shark.ConsentClient = require('./src/clients/consent-client')
Shark.ConsentChangesClient = require('./src/clients/consent-changes-client')
Shark.ContactClient = require('./src/clients/contact-client')
Shark.DescriptionClient = require('./src/clients/description-client')
Shark.GroupClient = require('./src/clients/group-client')
Shark.NotificationsClient = require('./src/clients/notifications-client')
Shark.ServiceTokenClient = require('./src/service-token/browser')
Shark.SubscriptionClient = require('./src/clients/subscription-client')
Shark.UserClient = require('./src/clients/user-client')
Shark.fetch = require('./src/utils/simple-fetch')
Shark.isArray = isArray
Shark.isFunction = isFunction
Shark.isObject = isObject
Shark.isString = isString

module.exports = Shark
