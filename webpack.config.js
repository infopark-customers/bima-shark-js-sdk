"use strict";

const webpack           = require("webpack"),
      baseConfig        = require("./webpack.base.config"),
      path              = require("path"),
      LiveReloadPlugin  = require("webpack-livereload-plugin"),
      sdkVersion        = require("./package.json").version;

module.exports = {
  entry: path.join(__dirname, "src", "notification_service.js"),

  output: {
    path: path.join(__dirname, "dist", sdkVersion),
    filename: "bima-notifications-sdk.js"
  },

  plugins: [
    new LiveReloadPlugin(),
    new webpack.BannerPlugin("BImA-Notifications JS-SDK v" + sdkVersion),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: true,
        screw_ie8: true
      }
    })
  ].concat(baseConfig.plugins)
};
