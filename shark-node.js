'use strict'

// TODO https://github.com/qubyte/fetch-ponyfill/blob/master/fetch-node.js

/*
 * Configure shark-fetch with Node.js implementation
 */
const sharkFetch = require('./src/utils/shark-fetch')
const nodeFetch = require('node-fetch')

Object.assign(sharkFetch, {
  fetch: nodeFetch,
  Headers: nodeFetch.Headers,
  Request: nodeFetch.Request,
  Response: nodeFetch.Response
})

/*
 * Configure shark-upload-file with Node.js implementation
 */
const uploadFileNode = require('./src/utils/upload-file-node')
const sharkUploadFile = require('./src/utils/shark-upload-file')
Object.assign(sharkUploadFile, {
  uploadFile: uploadFileNode
})

/*
 * Configure Service Token Client
 */
const sharkServiceToken = require('./src/utils/shark-service-token')
const ServiceTokenClient = require('./src/service-token/node/client')
Object.assign(sharkServiceToken, {
  ServiceTokenClient: ServiceTokenClient
})

/*
 * Expose Shark API
 */
const Shark = require('./src/shark')
const { isArray, isFunction, isObject, isString } = require('./src/utils/typecheck')

Shark.ServiceTokenClient = ServiceTokenClient
Shark.ServiceTokenValidator = require('./src/service-token/node/validator')
Shark.Client = require('./src/clients/base-client')

Shark.ActivityClient = require('./src/clients/activity-client')
Shark.AppClient = require('./src/clients/app-client')
Shark.AssetClient = require('./src/clients/asset-client')
Shark.ConsentChangesClient = require('./src/clients/consent-changes-client')
Shark.ConsentClient = require('./src/clients/consent-client')
Shark.ContactClient = require('./src/clients/contact-client')
Shark.DescriptionClient = require('./src/clients/description-client')
Shark.GroupClient = require('./src/clients/group-client')
Shark.MailingClient = require('./src/clients/mailing-client')
Shark.NotificationsClient = require('./src/clients/notifications-client')
Shark.SubscriptionClient = require('./src/clients/subscription-client')
Shark.UserClient = require('./src/clients/user-client')

Shark.fetch = require('./src/utils/simple-fetch')
Shark.isArray = isArray
Shark.isFunction = isFunction
Shark.isObject = isObject
Shark.isString = isString

module.exports = Shark
