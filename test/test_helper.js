"use strict";

import fetchMock from "fetch-mock";
import Shark from "src/index";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

export const TEST = {
  BODY: { foo: 1, bar: "12345", baz: ["hello", "world", "!"]  },
  CLIENT_URL: "http://localhost:4000/",
  JWT: "01234567890123456789",
  SERVICE_TOKEN_URL: "http://localhost:4001/doorkeeper/service_token",
}


/*
 * Setup test config
 */
Shark.configure({
  serviceTokenUrl: TEST.SERVICE_TOKEN_URL,
});


/*
 * API request mocks
 */
export const setup = {
  serviceTokenSuccess: function() {
    beforeEach(function() {
      fetchMock.get(TEST.SERVICE_TOKEN_URL, {
        body: { jwt: TEST.JWT, expires_at: new Date() },
        status: 200,
      });
    });
  },
  serviceTokenError: function() {
    beforeEach(function() {
      fetchMock.get(TEST.SERVICE_TOKEN_URL, {
        body: "internal server error",
        status: 500,
      });
    });
  },
}

export function teardown() {
  afterEach(() => {
    fetchMock.restore();
  });
}

export default {
  setup,
  teardown,
  TEST,
};


