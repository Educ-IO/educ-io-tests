// -- Global Setup Routine -- //

// -- See: https://jestjs.io/docs/en/puppeteer -- //
// -- See: https://github.com/xfumihiro/jest-puppeteer-example -- //

const chalk = require("chalk");
const puppeteer = require("puppeteer");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const FN = require("../helpers/functions");

// -- Create / Load Config Object -- //
const CONFIG_PATH = process.env.TEST_CONFIG;
const CONFIG = CONFIG_PATH ? require(CONFIG_PATH.startsWith("/") ? CONFIG_PATH : path.resolve(CONFIG_PATH)) : {};
if (CONFIG_PATH) {
  console.log("");
  console.log("");
  console.log(chalk.magenta.dim(`LOADED CONFIG: ${JSON.stringify(CONFIG)}`));
}

// -- Override / Defaults -- //
CONFIG.site = process.env.TEST_URL ? process.env.TEST_URL : CONFIG.site ? CONFIG.site : "educ.io";
CONFIG.screenshots = process.env.TEST_SCREENSHOTS && process.env.TEST_SCREENSHOTS.toLowerCase() === "false" ? false : CONFIG.screenshots === false ? false : true;

CONFIG.user = CONFIG.user ? CONFIG.user : {}; // -- Defaults -- //
CONFIG.user.name = process.env.TEST_NAME ? process.env.TEST_NAME : CONFIG.user.name ? CONFIG.user.name : "";
CONFIG.user.email = process.env.TEST_EMAIL ? process.env.TEST_EMAIL : CONFIG.user.email ? CONFIG.user.email : "";
CONFIG.user.password = process.env.TEST_PASSWORD ? process.env.TEST_PASSWORD : CONFIG.user.password ? CONFIG.user.password : "";
CONFIG.user.code = process.env.TEST_CODE ? process.env.TEST_CODE : CONFIG.user.code ? CONFIG.user.code : "";
CONFIG.user.key = process.env.TEST_KEY ? process.env.TEST_KEY : CONFIG.user.key ? CONFIG.user.key : "";
CONFIG.user.captcha = process.env.TEST_CAPTCHA ? process.env.TEST_CAPTCHA : CONFIG.user.captcha ? CONFIG.user.captcha : "";
  
CONFIG.browser = CONFIG.browser ? CONFIG.browser : {}; // -- Defaults -- //
CONFIG.browser.chrome = CONFIG.browser.chrome ? CONFIG.browser.chrome : {}; // -- Defaults -- //
CONFIG.browser.width = process.env.WIDTH ? process.env.WIDTH : CONFIG.browser.width ? CONFIG.browser.width : 1366;
CONFIG.browser.height = process.env.HEIGHT ? process.env.HEIGHT : CONFIG.browser.height ? CONFIG.browser.height : 768;
CONFIG.browser.chrome.x = CONFIG.browser.chrome.x ? CONFIG.browser.chrome.x : 0;
CONFIG.browser.chrome.y = CONFIG.browser.chrome.y ? CONFIG.browser.chrome.y : 74;

// -- Runtime Configuration -- //
CONFIG.debug = process.env.TEST_DEBUG ? true : CONFIG.debug ? true : false;
CONFIG.verbose = process.env.TEST_VERBOSE ? true : CONFIG.verbose ? true : false;
CONFIG.timed = process.env.TEST_TIMED ? true : CONFIG.timed ? true : false;

/* jshint ignore:start */
module.exports = async function() {
  
  console.log("");
  console.log(chalk.yellow("Setting Up Puppeteer"));
  
  let err, browser, defaults = ["--no-sandbox", "--disable-setuid-sandbox", "--ignore-certificate-errors", "--disable-popup-blocking", "--incognito", `--window-size=${CONFIG.browser.width+CONFIG.browser.chrome.x},${CONFIG.browser.height+CONFIG.browser.chrome.y}`];
  
  [err, browser] = await FN.run(puppeteer.launch({
    ignoreHTTPSErrors: true, slowMo: 80,
    args: CONFIG.debug ?  defaults.concat(["--enable-logging", "--v=1", "--shm-size=1gb"]) : defaults,
    dumpio: CONFIG.debug ? true : false,
  }));
  
  if(err || !browser) {
    console.log(chalk.red(`Error Launching Browser:  ${JSON.stringify(err)}`));
  } else {
    global.__BROWSER_GLOBAL__ = browser;
    mkdirp.sync(FN.DIR);
  	fs.writeFileSync(path.join(FN.DIR, "wsEndpoint"), browser.wsEndpoint());
    console.log(chalk.green("Created: Headless Browser"));
  }

  // -- Write Configuration -- //
  fs.writeFileSync(path.join(FN.DIR, "config.json"), JSON.stringify(CONFIG));
  
  // -- Log Custom Configuration -- //
  console.log("");
  console.log(chalk.magenta.dim(`CONFIG: ${JSON.stringify(CONFIG)}`));
  console.log("");

}
/* jshint ignore:end */