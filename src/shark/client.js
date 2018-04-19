"use strict";

import param from "jquery-param";

import request from "src/utils/request";
import ServiceToken from "src/shark/service_token";

// TODO hack empty arrays?

/**
 * @class Client
 * @classdesc Basic REST client that can be instantiated for different models.
 *
 * @throws Will raise error if baseUrl is invalid
 */
class Client {
  constructor(options = {}) {
    this.name = options.name;
    this.baseUrl = options.url;
    this.config = {
      authorizationRequired: true,
      contentType: options.contentType || "application/vnd.api+json",
    };

    if (this.baseUrl && typeof this.baseUrl === "string") {
      if (this.baseUrl[0] === "/") {
        this.config.authorizationRequired = false;
      }
    } else {
      throw new Error("Parameter url is missing or not a string");
    }
  }

  /**
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  search(parameters = {}) {
    const url = this.buildUrl(null, parameters);
    return this.sendRequest(url);
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  find(id, parameters = {}) {
    const url = this.buildUrl(id, parameters);
    return this.sendRequest(url);
  }

  /**
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  create(data, parameters = {}) {
    const url = this.buildUrl(null, parameters);

    return this.sendRequest(url, {
      body: data,
      method: "POST",
    });
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [data] The data object / attribute hash.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  update(id, data, parameters = {}) {
    const url = this.buildUrl(id, parameters);

    return this.sendRequest(url, {
      body: data,
      method: "PUT",
    });
  }

  /**
   * @param  {integer} [id] The resource id.
   * @param  {object} [parameters] The query parameters as an object (optional).
   *
   * @return {promise} The request promise.
   */
  destroy(id, parameters = {}) {
    const url = this.buildUrl(id, parameters);
    return this.sendRequest(url, {
      method: "DELETE",
    });
  }

  /**
   * Makes an http request and returns a promise.
   *
   * @param  {string} [url] the url
   * @param  {object} [options] the options we want to pass to "fetch"
   *   - body   can be null
   *   - method must be GET, POST, PUT, PATCH or DELETE. Default is GET.
   *
   * @return {promise} the sendRequest promise
   */
  sendRequest(url, options = {}) {
    const opts = {};
    const self = this;

    opts.method = (options.method || "GET").toUpperCase();
    opts.headers = new Headers({
      "Content-Type": self.config.contentType
    });
    if (options.body) { opts.body = JSON.stringify(options.body) }

    if (this.config.authorizationRequired) {
      return ServiceToken.create().then(jwt => {
        opts.headers.set("Authorization", `Bearer ${jwt}`);
        return request(url, opts);
      });

    } else {
      opts.credentials = "same-origin";
      return request(url, opts);
    }
  }

  buildUrl(id, parameters) {
    let url = this.baseUrl;
    let queryString = param(parameters);

    if (url.slice(-1) !== "/") { url += "/" }
    if (id) { url += id }
    if (queryString.length > 0) { url += `?${queryString}`; }

    return url;
  }
}

export default Client;
