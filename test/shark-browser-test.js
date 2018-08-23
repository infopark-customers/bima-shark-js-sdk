/* eslint-env mocha */
'use strict'

/**
 * Fake window.fetch in a browser environment
 */
const nodeFetch = require('node-fetch')
global.window = {
  fetch: nodeFetch,
  Headers: nodeFetch.Headers,
  Request: nodeFetch.Request,
  Response: nodeFetch.Response
}

const { expect } = require('chai')
const Cache = require('../src/cache')
const Shark = require('../shark-browser')

describe('Browser version: Shark', () => {
  describe('.config', () => {
    it('should be an object', () => {
      expect(typeof Shark.config).to.eql('object')
    })

    it('should contain key #secret', () => {
      expect(typeof Shark.config.secret).to.eql('string')
    })
  })

  describe('.configure', () => {
    it('should be a function', () => {
      expect(typeof Shark.configure).to.eql('function')
    })

    it('should change the Shark.config', () => {
      const newSecret = '1234567890'
      Shark.configure({ foo: 1, secret: newSecret })

      expect(Shark.config.foo).to.eql(1)
      expect(Shark.config.secret).to.eql(newSecret)
    })

    it('should empty the internal cache', () => {
      Cache.store('secret-key', { foo: 1, secret: '1234567890' })

      Shark.configure()

      expect(Cache.data).to.eql({})
    })
  })

  describe('.Client', () => {
    it('should be a function', () => {
      expect(typeof Shark.Client).to.eql('function')
    })
  })
})
