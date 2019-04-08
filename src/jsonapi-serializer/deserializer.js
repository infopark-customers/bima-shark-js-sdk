'use strict'

const humps = require('humps')
const { isArray, isObject } = require('../utils/typecheck')

/**
 * @class Deserializer
 * @classdesc Deserialize a JSON-API response documents.
 *   Ignores deserialization of relationships and links.
 *
 * @example
 *   const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })
 *   deserializer.deserialize(json)
 */
class Deserializer {
  constructor (opts) {
    this.opts = opts || {}
  }

  deserialize (jsonapi) {
    if (jsonapi.data === undefined) {
      throw new Error('Cannot deserialize JSON without field `data`')
    } else if (isArray(jsonapi.data)) {
      return this.__collection(jsonapi)
    } else {
      return this.__resource(jsonapi)
    }
  }

  __collection (jsonapi) {
    return jsonapi.data.map(d => {
      return new Resource(jsonapi, d, this.opts).deserialize()
    })
  }

  __resource (jsonapi) {
    return new Resource(jsonapi, jsonapi.data, this.opts).deserialize()
  }
}

class Resource {
  constructor (jsonapi, data, opts) {
    this.jsonapi = jsonapi
    this.data = data
    this.opts = opts
    this.alreadyIncluded = []
  }

  deserialize () {
    const resource = this.__extractAttributes(this.data)
    const relatedResources = this.__extractRelationships(this.data)

    // TODO: deserialize links

    return Object.assign(resource, relatedResources)
  }

  __extractAttributes (data) {
    const resource = this.__keyForAttribute(data.attributes || {})

    if ('id' in data) {
      resource[this.opts.id || 'id'] = data.id
    }

    if (this.opts.typeAsAttribute) {
      if ('type' in data) {
        resource.type = data.type
      }
    }
    if ('meta' in data) {
      resource.meta = this.__keyForAttribute(data.meta || {})
    }

    return resource
  }

  __extractRelationships (data) {
    if (!data.relationships) {
      return
    }

    const dest = {}
    const self = this

    Object.keys(data.relationships).map(function (key) {
      const relationship = data.relationships[key]

      if (relationship.data === null) {
        dest[self.__keyForAttribute(key)] = null
      } else if (Array.isArray(relationship.data)) {
        relationship.data.map(function (relationshipData) {
          const includes = self.__findIncluded(relationshipData)

          if (includes) {
            dest[self.__keyForAttribute(key)] = includes
          }
        })
      } else {
        const include = self.__findIncluded(relationship.data)

        if (include) {
          dest[self.__keyForAttribute(key)] = include
        }
      }
    })

    return dest
  }

  __findIncluded (relationshipData) {
    if (!this.jsonapi.included || !relationshipData) {
      return null
    }

    const included = this.jsonapi.included.find(element => {
      return element.id === relationshipData.id && element.type === relationshipData.type
    })

    if (this.alreadyIncluded.indexOf(included) > -1) {
      return null
    } else {
      this.alreadyIncluded.push(included)
    }

    if (included) {
      const attributes = this.__extractAttributes(included)
      const relationships = this.__extractRelationships(included)
      return Object.assign(attributes, relationships)
    } else {
      return null
    }
  }

  __keyForAttribute (value) {
    if (this.opts.keyForAttribute === undefined || this.opts.keyForAttribute === 'camelCase') {
      if (isArray(value) || isObject(value)) {
        return humps.camelizeKeys(value)
      } else {
        return humps.camelize(value)
      }
    } else {
      return value
    }
  }
}

module.exports = Deserializer
