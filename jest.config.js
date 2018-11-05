const {defaults} = require("jest-config");

module.exports = {
  globals: {},
  globalSetup: "./common/setup.js",
  globalTeardown: "./common/teardown.js",
  testEnvironment: "./common/environment.js",
  setupTestFrameworkScriptFile: "./common/timeout.js",
  verbose: false,
  testMatch: [ "**/runners/jest-*test.js?(x)", "**/?(*.)+(spec|test).js?(x)" ]
};