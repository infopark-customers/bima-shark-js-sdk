module.exports = {
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/test-helper.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom'
}
