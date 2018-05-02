"use strict";

const webpackConfig = require("./webpack.config.js");
const path = require("path");
const webpack = require("webpack");

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

      mode: "production",

      module: webpackConfig.module,

      resolve: webpackConfig.resolve,

      plugins: webpackConfig.plugins,

      performance: {
        hints: process.env.NODE_ENV === "production" ? "warning" : false
      },
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
    ],

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
