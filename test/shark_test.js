"use strict";

import Shark from "src/index";
import { Client, ServiceToken } from "src/index";


describe("default export Shark", function() {
  it("should be an Object", function() {
    expect(typeof Shark).toEqual("object");
  });


  describe(".config", function() {
    it("should be an object", function() {
      expect(typeof Shark.config).toEqual("object");
    });
  });

  describe(".configure", function() {
    it("should be a function", function() {
      expect(typeof Shark.configure).toEqual("function");
    });

    it("should change the Shark.config", function() {
      Shark.configure({ foo: 1 });
      expect(Shark.config.foo).toEqual(1);
    });
  });
});

describe("export Client", function() {
  it("should be a function", function() {
    expect(typeof Client).toEqual("function");
  });
});

describe("export ServiceToken", function() {
  it("should be a function", function() {
    expect(typeof ServiceToken).toEqual("function");
  });
});
