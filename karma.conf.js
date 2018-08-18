'use strict'

const webpackConfig = require('./webpack.config.js')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*_test.js'
    ],

    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/**/*_test.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',

      mode: 'development',

      module: webpackConfig.module,

      resolve: webpackConfig.resolve,

      plugins: webpackConfig.plugins,

      performance: {
        hints: false
      }
    },

    webpackServer: {
      noInfo: true
    },

    plugins: [
      'karma-webpack',
      'karma-chai',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],

    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false
  })

  if (process.env.TRAVIS) {
    config.browsers = ['Firefox']
  } else {
    config.browsers = ['Chrome', 'Firefox']
  }
}
