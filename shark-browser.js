'use strict'

/*
 * Configure shark-fetch with Browser implementation
 */
const sharkFetch = require('./src/utils/shark-fetch')
Object.assign(sharkFetch, {
  fetch: window.fetch,
  Headers: window.Headers,
  Request: window.Request,
  Response: window.Response
})

/*
 * Configure shark-upload-file with Browser implementation
 */
const uploadFileBrowser = require('./src/utils/upload-file-browser')
const sharkUploadFile = require('./src/utils/shark-upload-file')
Object.assign(sharkUploadFile, {
  uploadFile: uploadFileBrowser
})

/*
 *  Expose util functions
 */

const { simpleFetch } = require('./src/utils/simple-fetch')
const {
  isArray,
  isFunction,
  isObject,
  isString
} = require('./src/utils/typecheck')

/*
 * Expose Shark clients
 */
const Shark = require('./src/shark')

Shark.Client = require('./src/clients/base-client')
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
Shark.fetch = simpleFetch
Shark.isArray = isArray
Shark.isFunction = isFunction
Shark.isObject = isObject
Shark.isString = isString

module.exports = Shark
