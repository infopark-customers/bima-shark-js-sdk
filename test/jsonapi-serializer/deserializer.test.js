/* eslint-env jest */
'use strict'

const Deserializer = require('../../src/jsonapi-serializer/deserializer')

const USER_ID = '5490143e69e49d0c8f9fc6bc'

const BODY = {
  data: {
    type: 'users',
    id: USER_ID,
    attributes: {
      first_name: 'Roger',
      last_name: 'Rabbit'
    },
    relationships: {
      permission: {
        data: {
          type: 'permissions',
          id: USER_ID
        }
      }
    }
  },
  included: [{
    type: 'permissions',
    id: USER_ID,
    attributes: {
      rules: {
        'immocrm::cm::person': {
          resource: 'immocrm::cm::person',
          privileges: {
            visitor: true
          },
          effect: 'ALLOW',
          parent: 'immocrm::cm'
        },
        'immocrm::zefm::fm_gewerbe': {
          resource: 'immocrm::zefm::fm_gewerbe',
          privileges: {
            admin: true
          },
          effect: 'ALLOW',
          parent: 'immocrm::zefm'
        },
        paragraph: {
          resource: 'paragraph',
          privileges: {
            admin: true
          },
          effect: 'ALLOW',
          parent: null
        }
      }
    }
  }]
}

describe('Deserializer', () => {
  const deserializer = new Deserializer({
    keyForAttribute: 'camelCase',
    caseConversionStopPaths: { permissions: ['rules'] }
  })

  describe('#deserialize', () => {
    it('should return an object with camelCased attributes', () => {
      const subject = deserializer.deserialize(BODY)
      const attributes = BODY.data.attributes

      expect(subject.firstName).toEqual(attributes.first_name)
      expect(subject.lastName).toEqual(attributes.last_name)
    })

    it('should extract included relationships except permissions', () => {
      const subject = deserializer.deserialize(BODY)
      const permissionRules = BODY.included[0].attributes.rules

      expect(Object.keys(subject.permission.rules).sort())
        .toEqual(Object.keys(permissionRules).sort())

      expect(Object.keys(permissionRules)).toContain('immocrm::zefm::fm_gewerbe')
      expect(Object.keys(permissionRules)).not.toContain('immocrm::zefm::fmGewerbe')
    })
  })
})
