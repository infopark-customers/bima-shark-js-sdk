/* eslint-env jest */
'use strict'

const Cache = require('../../src/cache')
const Shark = require('../../shark-browser')

describe('Browser version: Shark', () => {
  describe('.config', () => {
    it('should be an object', () => {
      expect(typeof Shark.config).toEqual('object')
    })

    it('should contain key #secret', () => {
      expect(typeof Shark.config.secret).toEqual('string')
    })
  })

  describe('.configure', () => {
    it('should be a function', () => {
      expect(typeof Shark.configure).toEqual('function')
    })

    it('should change the Shark.config', () => {
      const newSecret = '1234567890'
      Shark.configure({ foo: 1, secret: newSecret })

      expect(Shark.config.foo).toEqual(1)
      expect(Shark.config.secret).toEqual(newSecret)
    })

    it('should empty the internal cache', () => {
      Cache.store('secret-key', { foo: 1, secret: '1234567890' })

      Shark.configure()

      expect(Cache.data).toEqual({})
    })
  })

  describe('.Client', () => {
    it('should be a function', () => {
      expect(typeof Shark.Client).toEqual('function')
    })
  })
})
