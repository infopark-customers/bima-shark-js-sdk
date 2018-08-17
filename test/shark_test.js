/* eslint-env mocha */
'use strict'

const { expect } = require('chai')

const Shark = require('../src/index')
const { Client, ServiceTokenClient } = Shark

describe('default export Shark', () => {
  it('should be an Object', () => {
    expect(typeof Shark).to.eql('object')
  })

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
  })

  describe('.createClient', () => {
    it('should be a function', () => {
      expect(typeof Shark.createClient).to.eql('function')
    })

    it('should return a Shark.Client', () => {
      const client = Shark.createClient({
        name: 'FooClient',
        url: 'https://contactservice.bundesimmo.de/api/groups',
        contentType: 'application/vnd.api+json'
      })
      expect(client instanceof Shark.Client).to.eql(true)
    })
  })
})

describe('export Client', () => {
  it('should be a function', () => {
    expect(typeof Client).to.eql('function')
  })
})

describe('export ServiceTokenClient', () => {
  it('should be a function', () => {
    expect(typeof ServiceTokenClient).to.eql('function')
  })
})
