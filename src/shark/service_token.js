"use strict";

import isString from "src/utils/is_string";
import request from "src/utils/request";
import Config from "src/shark/config";

const TOKEN_STORAGE_KEY = "api-service-token";

/**
 * @class ServiceToken
 * @classdesc Helper class to request and manage a valid service token.
 */
class ServiceToken {
  /*
   * @return {Promise} the fetch promise
   * @api public
   */
  static create() {
    const client = new ServiceToken({
      url: Config.serviceTokenUrl,
    });
    const token = client.lookup();

    if (token && token.expires_at) {
      let now = new Date();
      let date = new Date(token.expires_at);
      if (date < now) {
        return client.requestToken();
      } else {
        return new Promise((resolve, reject) => { resolve(token.jwt); });
      }
    } else {
      return client.requestToken();
    }
  }

  constructor(options) {
    if (isString(options.url)) {
      this.url = options.url;
    } else {
      throw new Error("Parameter url is missing or not a string")
    }

    this.storage = window.sessionStorage;
  }

  requestToken() {
    const self = this;
    self.remove();

    return request(this.url)
      .then(token => {
        self.store(token);
        return token.jwt;
      });
  }

  lookup() {
    const jwt = this.storage.getItem(TOKEN_STORAGE_KEY);
    return JSON.parse(jwt);
  }

  store(token) {
    const jwt = JSON.stringify(token);
    this.storage.setItem(TOKEN_STORAGE_KEY, jwt);
  }

  remove() {
    this.storage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export default ServiceToken;
