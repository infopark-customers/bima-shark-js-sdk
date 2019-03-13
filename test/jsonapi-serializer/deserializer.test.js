/* eslint-env jest */
'use strict'

const Deserializer = require('../../src/jsonapi-serializer/deserializer')
const BODY = {
  data: {
    type: 'users',
    id: '5490143e69e49d0c8f9fc6bc',
    attributes: {
      'first_name': 'Roger',
      'last_name': 'Rabbit'
    }
  }
}

describe('Deserializer', () => {
  const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })

  describe('#deserialize', () => {
    it('should return an object with camelCased attributes', () => {
      const subject = deserializer.deserialize(BODY)
      const attributes = BODY.data.attributes

      expect(subject.firstName).toEqual(attributes.first_name)
      expect(subject.lastName).toEqual(attributes.last_name)
    })
  })
})
