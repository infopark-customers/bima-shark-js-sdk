/* eslint-env jasmine */
'use strict'

import Shark, { Client, ServiceToken } from 'src/index'

describe('default export Shark', function () {
  it('should be an Object', function () {
    expect(typeof Shark).toEqual('object')
  })

  describe('.config', function () {
    it('should be an object', function () {
      expect(typeof Shark.config).toEqual('object')
    })

    it('should contain key #secret', function () {
      expect(typeof Shark.config.secret).toEqual('string')
    })
  })

  describe('.configure', function () {
    it('should be a function', function () {
      expect(typeof Shark.configure).toEqual('function')
    })

    it('should change the Shark.config', function () {
      const newSecret = '1234567890'
      Shark.configure({ foo: 1, secret: newSecret })

      expect(Shark.config.foo).toEqual(1)
      expect(Shark.config.secret).toEqual(newSecret)
    })
  })

  describe('.createClient', function () {
    it('should be a function', function () {
      expect(typeof Shark.createClient).toEqual('function')
    })

    it('should return a Shark.Client', function () {
      const client = Shark.createClient({
        name: 'FooClient',
        url: 'https://contactservice.bundesimmo.de/api/groups',
        contentType: 'application/vnd.api+json'
      })
      expect(client instanceof Shark.Client).toEqual(true)
    })
  })
})

describe('export Client', function () {
  it('should be a function', function () {
    expect(typeof Client).toEqual('function')
  })
})

describe('export ServiceToken', function () {
  it('should be a function', function () {
    expect(typeof ServiceToken).toEqual('function')
  })
})
