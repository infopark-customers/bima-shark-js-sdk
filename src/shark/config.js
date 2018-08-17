'use strict'

const uuidv1 = require('uuid/v1')

const Config = {
  debug: false,
  nodeProcess: (typeof process !== 'undefined'),
  secret: uuidv1(),
  serviceTokenUrl: '/doorkeeper/service_token'
}

module.exports = Config
