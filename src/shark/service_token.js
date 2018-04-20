"use strict";

import isString from "src/utils/is_string";
import request from "src/utils/request";
import Config from "src/shark/config";

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
      tokenStorageKey: "api-service-token/" + Config.secret,
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
    this.tokenStorageKey = options.tokenStorageKey;
  }

  requestToken() {
    const self = this;
    self.remove();

    return request(this.url, {
        credentials: "same-origin"
      })
      .then(json => {
        const token = json.attributes;
        self.store(token);
        return token.jwt;
      });
  }

  lookup() {
    const token_string = this.storage.getItem(this.tokenStorageKey);
    return JSON.parse(token_string);
  }

  store(token) {
    const token_string = JSON.stringify(token);
    this.storage.setItem(this.tokenStorageKey, token_string);
  }

  remove() {
    this.storage.removeItem(this.tokenStorageKey);
  }
}

export default ServiceToken;
