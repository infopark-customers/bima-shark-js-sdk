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
  }

  deserialize () {
    const resource = this.__extractAttributes(this.data)

    // TODO: deserialize relationships
    // TODO: deserialize links

    return resource
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
      resource.meta = this.keyForAttribute(data.meta || {})
    }

    return resource
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
