"use strict";

import "whatwg-fetch";

import Config from "src/shark/config";
import Client from "src/shark/client";
import ServiceToken from "src/shark/service_token";

/*
 * @class Shark
 * @classdesc Namespace for REST client and configuration.
 *
 */
const Shark = {
  Client: Client,
  ServiceToken: ServiceToken,

  // Shark configuration
  config: Config,

  // Use this method to configure Shark
  configure: function(options) {
    Object.assign(Shark.config, options);
  },
}

export default Shark;
