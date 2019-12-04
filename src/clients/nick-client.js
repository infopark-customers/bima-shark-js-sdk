'use strict'

const Client = require('./base-client')

/**
 * @class NickClient
 * @classdesc Nick Service client.
 */
class NickClient {
  constructor (url, options = {}) {
    this.client = new Client({
      name: 'NickClient',
      url: `${url}`,
      serviceToken: options.serviceToken
    })
  }

  /**
   * @param {string} [type] The resource type.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  index (type, parameters = {}) {
    return this.client.get(type, parameters)
  }

  /**
   * @param {string} [type] The resource type.
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  find (type, id, parameters = {}) {
    return this.client.get(`${type}/${id}`, parameters)
  }

  /**
   * @param {string} [type] The resource type.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  create (type, data, parameters = {}) {
    return this.client.post(type, data, parameters)
  }

  /**
   * @param {string} [type] The resource type.
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  update (type, id, data, parameters = {}) {
    return this.client.put(`${type}/${id}`, data, parameters)
  }

  /**
   * @param {string} [type] The resource type.
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  destroy (type, id, parameters = {}) {
    return this.client.delete(`${type}/${id}`, parameters)
  }

  /**
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  accessibilityCatalog (parameters = {}) {
    return this.client.get('accessibility/catalog', parameters)
  }

  /**
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  accessibilityQuestions (parameters = {}) {
    return this.client.get('accessibility/questions', parameters)
  }

  /**
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  userinfo (parameters = {}) {
    return this.client.get('userinfo', parameters)
  }

  /**
   * @param  {object} [data] The data object.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  createAsset(data, parameters = {}) {
    return this.client.post('assets', data, parameters)
  }
}

module.exports = NickClient
