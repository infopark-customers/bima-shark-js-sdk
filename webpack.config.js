"use strict";

const webpack           = require("webpack"),
      baseConfig        = require("./webpack.base.config"),
      path              = require("path"),
      LiveReloadPlugin  = require("webpack-livereload-plugin"),
      sdkVersion        = require("./package.json").version;

module.exports = {
  entry: path.join(__dirname, "src", "bima-notifications-sdk.js"),

  output: {
    path: path.join(__dirname, "dist", sdkVersion),
    filename: "bima-notifications-sdk.js"
  },

  plugins: [
    new LiveReloadPlugin(),
    new webpack.DefinePlugin({
      SDK_VERSION: sdkVersion
    })
  ].concat(baseConfig.plugins)
};
