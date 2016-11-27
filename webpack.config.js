"use strict";

const webpack             = require("webpack"),
         path             = require("path"),
         LiveReloadPlugin = require("webpack-livereload-plugin")

let config = {
  entry: path.join(__dirname, "src/bima-notification-manager.js"),

  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "bima-notification-manager.js"
  },

  plugins: [
    new LiveReloadPlugin()
  ]
};

module.exports = config;
