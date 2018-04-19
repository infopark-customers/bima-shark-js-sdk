"use strict";

import fetchMock from "fetch-mock";
import { setup, teardown, TEST } from "test/test_helper";
import Client from "src/shark/client";

const client = new Client({
  name: "TestClient",
  url: TEST.CLIENT_URL,
  contentType: "application/vnd.api+json",
});

function mockBody(body, status = 200) {
  return function(url, options) {
    if (options.headers.get("Authorization") == `Bearer ${TEST.JWT}`) {
      return {
        body: body || options.body,
        status: status,
      };
    } else {
      return {
        body: { message: "Access forbidden" },
        status: 403,
      };
    }
  }
}

/**
 * Use 'done()' for asynchronous Jasmine testing.
 * https://jasmine.github.io/tutorials/async
 */
describe("Client with successful service tokens", function() {
  setup.serviceTokenSuccess();
  teardown();

  describe("#baseUrl", function() {
    it("should be a valid url", function() {
      expect(client.baseUrl).toEqual(TEST.CLIENT_URL);
    });
  });

  describe("#config", function() {
    it("should have a contentType", function() {
      expect(client.config.contentType).toEqual("application/vnd.api+json");
    });
  });

  describe("#search", function() {
    describe("on success", function() {
      beforeEach(function() {
        fetchMock.get(TEST.CLIENT_URL + "?include=contacts",
          mockBody([TEST.BODY, TEST.BODY])
        );
      });

      it("should return json", function(done) {
        const promise = client.search({ include: "contacts" });
        promise.then(body => {
          expect(body).toEqual([TEST.BODY, TEST.BODY]);
          done();
        });
      });
    });
  });

  describe("#find", function() {
    describe("on success", function() {
      beforeEach(function() {
        fetchMock.get(TEST.CLIENT_URL + "1",
          mockBody(TEST.BODY)
        );
      });

      it("should return json", function(done) {
        const promise = client.find(1);
        promise.then(body => {
          expect(body).toEqual(TEST.BODY);
          done();
        });
      });
    });

    describe("on access forbidden", function() {
      beforeEach(function() {
        fetchMock.get(TEST.CLIENT_URL + "1",
          mockBody({ message: "Access forbidden" }, 403)
        );
      });

      it("should reject with a ClientError", function(done) {
        const promise = client.find(1);
        promise.then(body => {
          done.fail("client#find() was resolved, but it should fail!");
        }, error => {
          expect(error.name).toEqual("ClientError");
          expect(error.status).toEqual(403);
          expect(error.json).toEqual({ message: "Access forbidden" });
          done();
        });
      });
    });

    describe("on not found", function() {
      beforeEach(function() {
        fetchMock.get(TEST.CLIENT_URL + "1",
          mockBody({ message: "Object not found" }, 404)
        );
      });

      it("should reject with a ClientError", function(done) {
        const promise = client.find(1);
        promise.then(body => {
          done.fail("client#find() was resolved, but it should fail!");
        }, error => {
          expect(error.name).toEqual("ClientError");
          expect(error.status).toEqual(404);
          expect(error.json).toEqual({ message: "Object not found" });
          done();
        });
      });
    });
  });

  describe("#create", function() {
    describe("on success", function() {
      beforeEach(function() {
        fetchMock.post(TEST.CLIENT_URL,
          mockBody(TEST.BODY)
        );
      });

      it("should return json", function(done) {
        const promise = client.create(TEST.BODY);
        promise.then(body => {
          expect(body).toEqual(TEST.BODY);
          done();
        });
      });
    });
  });

  describe("#update", function() {
    describe("on success", function() {
      beforeEach(function() {
        fetchMock.put(TEST.CLIENT_URL + "1",
          mockBody(TEST.BODY)
        );
      });

      it("should return json", function(done) {
        const promise = client.update(1, TEST.BODY);
        promise.then(body => {
          expect(body).toEqual(TEST.BODY);
          done();
        });
      });
    });
  });

  describe("#destroy", function() {
    describe("on success 200 with body", function() {
      beforeEach(function() {
        fetchMock.delete(TEST.CLIENT_URL + "1",
          mockBody({ message: "Object deleted" }, 200)
        );
      });

      it("should return json", function(done) {
        const promise = client.destroy(1);
        promise.then(body => {
          expect(body).toEqual({ message: "Object deleted" });
          done();
        });
      });
    });

    describe("on success 204 without body", function() {
      beforeEach(function() {
        fetchMock.delete(TEST.CLIENT_URL + "1",
          mockBody(null, 204)
        );
      });

      it("should return empty json", function(done) {
        const promise = client.destroy(1);
        promise.then(body => {
          expect(body).toEqual({});
          done();
        });
      });
    });

    describe("on success 204 with body", function() {
      beforeEach(function() {
        fetchMock.delete(TEST.CLIENT_URL + "1",
          mockBody({ message: "Object deleted" }, 204)
        );
      });

      it("should reject with a TypeError", function(done) {
        const promise = client.destroy(1);
        promise.then(body => {
          done.fail("client#find() was resolved, but it should fail!");
        }, error => {
          expect(error.name).toEqual("Error");
          done();
        });
      });
    });
  });
});

describe("Client with failed service tokens", function() {
  setup.serviceTokenError();
  teardown();

  describe("#find", function() {
    describe("on success", function() {
      beforeEach(function() {
        fetchMock.get(TEST.CLIENT_URL + "1",
          mockBody(TEST.BODY)
        );
      });

      it("should reject with a ServerError", function(done) {
        const promise = client.find(1);
        promise.then(body => {
          done.fail("client#find() was resolved, but it should fail!");
        }, error => {
          expect(error.name).toEqual("ServerError");
          expect(error.status).toEqual(500);
          done();
        })
      });
    });
  });
});

const internalClient = new Client({
  name: "TestClientWithoutAuthenticationHeader",
  url: "/",
});

describe("Client without authentication", function() {
  teardown();

  describe("#find", function() {
    describe("on success", function() {
      beforeEach(function() {
        fetchMock.get("/1", {
          body: TEST.BODY,
          status: 200,
        });
      });

      it("should return json", function(done) {
        const promise = internalClient.find(1);
        promise.then(body => {
          expect(body).toEqual(TEST.BODY);
          done();
        });
      });
    });
  });
});
