/* eslint-env mocha */
'use strict'

const { expect } = require('chai')

const Deserializer = require('../../src/jsonapi-serializer/deserializer')
const BODY = require('../test-helper').USER_RESPONSE_BODY

describe('Deserializer', () => {
  const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })

  describe('#deserialize', () => {
    it('should return an object with camelCased attributes', () => {
      const subject = deserializer.deserialize(BODY)
      const attributes = BODY.data.attributes

      expect(subject.firstName).to.eql(attributes.first_name)
      expect(subject.lastName).to.eql(attributes.last_name)
    })
  })
})
