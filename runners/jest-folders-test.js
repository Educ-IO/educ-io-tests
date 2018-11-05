const FN = require("../helpers/functions");
const SIMPLE = require("../tests/simple");

const APP = "folders", DIR = {
  output: `outputs/${APP}`,
  trace: `traces/${APP}`
};

var config = global.__CONFIG__, url = `https://${config.site}/${APP}`;
let page, screenshot = FN.screenshot(DIR.output);

// -- Set-Up Methods -- //
/* jshint ignore:start */
beforeAll(async () => page = await FN.setup(DIR));
/* jshint ignore:end */

/* jshint ignore:start */
describe(`Testing the ${APP.toUpperCase()} App`, async () => {
  
  beforeAll(require("../helpers/start")(() => page, url));

  describe(`Testing Sign-In Process [${APP.toUpperCase()}]`, require("../tests/login")(() => page, screenshot));
  
  describe(`Testing Initial Content [${APP.toUpperCase()}]`, require("../tests/content")(() => page, screenshot));
  
  afterAll(() => page ? page.close() : true);
  
});
/* jshint ignore:end */