'use strict'

const uuidv4 = require('uuid/v4')

module.exports = {
  debug: false,
  secret: uuidv4(),
  serviceTokenUrl: '/doorkeeper/service_token'
}
