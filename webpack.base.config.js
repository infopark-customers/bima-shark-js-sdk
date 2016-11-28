"use strict";

const webpack = require("webpack");

module.exports = {
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

  plugins: []
};
