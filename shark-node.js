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
 * Configure shark-service-token with Node.js implementation
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
Shark.Client = require('./src/service-clients/client')

Shark.ActivityClient = require('./src/service-clients/activity-client')
Shark.AppClient = require('./src/service-clients/app-client')
Shark.AssetClient = require('./src/service-clients/asset-client')
Shark.ConsentChangesClient = require('./src/service-clients/consent-changes-client')
Shark.ConsentClient = require('./src/service-clients/consent-client')
Shark.ContactClient = require('./src/service-clients/contact-client')
Shark.DescriptionClient = require('./src/service-clients/description-client')
Shark.GroupClient = require('./src/service-clients/group-client')
Shark.MailingClient = require('./src/service-clients/mailing-client')
Shark.NotificationsClient = require('./src/service-clients/notifications-client')
Shark.SubscriptionClient = require('./src/service-clients/subscription-client')
Shark.UserClient = require('./src/service-clients/user-client')

Shark.fetch = require('./src/utils/simple-fetch')
Shark.isArray = isArray
Shark.isFunction = isFunction
Shark.isObject = isObject
Shark.isString = isString

module.exports = Shark
