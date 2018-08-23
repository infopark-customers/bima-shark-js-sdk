/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const Shark = require('../shark-node')

describe('Node version Shark: ', () => {
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

  describe('.ServiceTokenClient', () => {
    it('should be a function', () => {
      expect(typeof Shark.ServiceTokenClient).to.eql('function')
    })
  })
})
