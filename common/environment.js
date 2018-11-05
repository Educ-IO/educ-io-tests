// -- Test Setup Routine -- //
const Environment = require("jest-environment-jsdom");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const FN = require("../helpers/functions");

const CONFIG = JSON.parse(fs.readFileSync(path.join(FN.DIR, "config.json"), "utf8"))

/* jshint ignore:start */
class CustomEnvironment extends Environment {
  constructor(config) {
    super(config);
  };

  async setup() {
    
    await super.setup();
    const wsEndpoint = fs.readFileSync(path.join(FN.DIR, "wsEndpoint"), "utf8");
    if (!wsEndpoint) throw new Error("wsEndpoint not found");

    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    
    // -- Incoming Process Variables -- //
    this.global.__CONFIG__ = CONFIG;
  };

  async teardown() {
    await super.teardown();
  };

  runScript(script) {
    return super.runScript(script);
	};
};
/* jshint ignore:end */

module.exports = CustomEnvironment;