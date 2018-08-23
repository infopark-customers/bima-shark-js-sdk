'use strict'

/**
 * https://stackoverflow.com/questions/44541561/webpack-output-is-empty-object
 **/
const webpack = require('webpack')
const path = require('path')
const sdkVersion = require('./package.json').version

module.exports = {
  entry: [
    path.join(__dirname, 'shark-browser.js')
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bima-shark-sdk.js',
    library: 'Shark',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      'dist': path.join(__dirname, '/dist'),
      'node_modules': path.join(__dirname, '/node_modules'),
      'src': path.join(__dirname, '/src'),
      'test': path.join(__dirname, '/test')
    }
  },

  mode: 'production',

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'standard-loader'
        }
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },

  optimization: {
    minimize: true
  },

  performance: {
    hints: 'warning'
  },

  plugins: [
    new webpack.BannerPlugin('BImA-Shark JS-SDK v' + sdkVersion)
  ]
}
