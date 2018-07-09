'use strict';

/**
 * https://stackoverflow.com/questions/44541561/webpack-output-is-empty-object
 **/
const webpack           = require('webpack'),
      path              = require('path'),
      sdkVersion        = require('./package.json').version;

module.exports = {
  entry: [
    'isomorphic-fetch',
    path.join(__dirname, 'src', 'index.js'),
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bima-shark-sdk.js',
    library: 'Shark',
    libraryTarget: 'commonjs2'
  },

  target: 'node',

  resolve: {
    extensions: ['.js'],
    alias: {
      'dist': __dirname + '/dist',
      'node_modules': __dirname + '/node_modules',
      'src': __dirname + '/src',
      'test': __dirname + '/test',
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'standard-loader',
        }
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          }
        }
      }
    ]
  },

  optimization: {
    minimize: true
  },

  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },

  plugins: [
    new webpack.BannerPlugin('BImA-Shark JS-SDK v' + sdkVersion),
  ]
};
