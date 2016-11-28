"use strict";

const baseConfig  = require("./webpack.base.config.js"),
      path        = require("path"),
      webpack     = require("webpack");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
      "test/**/*_test.js"
    ],

    preprocessors: {
      "src/**/*.js": ["webpack", "sourcemap"],
      "test/**/*_test.js": ["webpack", "sourcemap"]
    },

    webpack: {
      devtool: "inline-source-map",

      resolve: {
        extensions: ["", ".js"],
        alias: {
          "deploy": __dirname + "/deploy",
          "dist": __dirname + "/dist",
          "node_modules": __dirname + "/node_modules",
          "root": __dirname,
          "src": __dirname + "/src",
        }
      },

      plugins: [
        new webpack.ProvidePlugin({ faker: require("faker") })
      ]
    },

    webpackServer: {
      noInfo: true
    },

    plugins: [
      "karma-webpack",
      "karma-jasmine",
      "karma-sourcemap-loader",
      "karma-chrome-launcher",
      "karma-firefox-launcher"
    ].concat(baseConfig.plugins),

    customLaunchers: {
      Chrome_without_sandbox: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },

    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
  });

  if (process.env.TRAVIS) {
    config.browsers = ["Chrome_without_sandbox", "Firefox"];
  }
  else {
    config.browsers = ["Chrome", "Firefox"];
  }
};
