/* eslint-env mocha */
/* global expect */
'use strict'

import Deserializer from 'src/jsonapi-serializer/deserializer'
const BODY = require('test/test_helper').SERVICE_TOKEN_RESPONSE_BODY

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
