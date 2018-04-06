"use strict";

import { setup, teardown, TEST } from "test/test_helper";
import ServiceToken from "src/shark/service_token";

/*
 * Use 'done()' for asynchronous Jasmine testing.
 * https://jasmine.github.io/tutorials/async
 */
describe("ServiceToken.create", function() {
  teardown();

  describe("on success", function() {
    setup.serviceTokenSuccess();

    it("should create a Promise", function() {
      const promise = ServiceToken.create();
      expect(promise instanceof Promise).toEqual(true);
    });

    it("should create a Promise that resolves to a JWT", function(done) {
      const promise = ServiceToken.create();
      promise.then(token => {
        expect(token).toEqual(TEST.JWT);
        done();
      });
    });
  });

  describe("on failure", function() {
    setup.serviceTokenError();

    it("should create a Promise that is rejected", function(done) {
      const promise = ServiceToken.create();
      promise.then(token => {
        done.fail("ServiceToken.create() was resolved, but it should fail!");
      }, error => {
        expect(error.name).toEqual("ServerError");
        expect(error.status).toEqual(500);
        expect(error.json.message).toEqual("internal server error");
        done();
      });
    });
  });
});
