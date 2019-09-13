/* eslint-env jest */
'use strict'

const nodeFetch = require('node-fetch')

const SharkProxy = require('../../src/proxy')

SharkProxy.fetch = nodeFetch
SharkProxy.Headers = nodeFetch.Headers
SharkProxy.Request = nodeFetch.Request
SharkProxy.Response = nodeFetch.Response
