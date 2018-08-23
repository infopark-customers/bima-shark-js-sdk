'use strict'

const uuidv1 = require('uuid/v1')

module.exports = {
  debug: false,
  secret: uuidv1(),
  serviceTokenUrl: '/doorkeeper/service_token'
}
