// -- Import Modules -- //
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const os = require("os");

// -- Working Variables -- //
var config = global.__CONFIG__, browser = global.__BROWSER__;

const DIR = path.join(os.tmpdir(),"jest_puppeteer_global_setup");

// -- Function Definitions -- //
const IS_FUNCTION = o => !!(o && o.constructor && o.call && o.apply);

// -- GoLang-Style Array Return Wrapper -- //
// -- See: http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/ -- //
const RUN = promise => promise.then(data => [null, data]).catch(err => [err]);

const DELAY = ms => new Promise(resolve => setTimeout(resolve, ms));

const ACTION = function(name, context, fn /*, args */) {
  if (config.timed) console.time(name);
  return new Promise((resolve, reject) => {
    const error = err => {
      console.error(chalk.red(`ERRORED: ${name} == ${err}`));
      if (config.timed) console.timeEnd(name);
      resolve();
    };
    try {
      var args = Array.prototype.slice.call(arguments, 3);
      if (config.verbose) console.log(chalk.gray(`RUNNING: ${name}`), args);
      let result = fn.apply(context, args);
      if (IS_FUNCTION(result.then)) {
        if (config.verbose) console.log(chalk.gray(`WAITING: ${name} returns a PROMISE, attempting to resolve`));
        result.then(data => {
          if (config.verbose) console.log(chalk.gray(`COMPLETED: ${name} => Resolved`));
          if (config.timed) console.timeEnd(name);
          resolve(data);
        }).catch(error);
      } else {
        if (config.verbose) console.log(chalk.gray(`COMPLETED: ${name} => Returned`));
        if (config.timed) console.timeEnd(name);
        resolve(result);
      }  
    } catch (err) {
      error(err);
    }
  });
};

const SCREENSHOT = folder => (page, name, full) => config.screenshots ? ACTION(`Screenshot [${page.url()}]`, page, page.screenshot, {path : path.join(folder, `${name}${name.endsWith(".png") ? "" : ".png"}`), fullPage : full ? true : false}) : Promise.resolve();

// -- Setup Function -- //
async function page(resolve, reject) {
  let err, page, nothing;
  [err, page] = await RUN(browser.newPage());
  if (err || !page) reject("Error Creating New Page: " + JSON.stringify(err));

  [err, nothing] = await RUN(page.setViewport({width: config.browser.width, height: config.browser.height}));
  if (err) reject("Error Setting Page Viewport: " + JSON.stringify(err));

  if (config.debug) console.log(chalk.gray("PAGE:", page));

  resolve(page);
}

module.exports = {
  DIR : DIR,
  is_function : IS_FUNCTION,
  run : RUN,
  delay : DELAY,
  action : ACTION,
  screenshot : SCREENSHOT,
  setup : dirs => {
    if (dirs) for (const key in dirs) !fs.existsSync(dirs[key]) && fs.mkdirSync(dirs[key]);
    return new Promise(page);
  },
  value : value => IS_FUNCTION(value) ? value() : value,
  test : () => {
    // console.log(browser);
    console.log(config);
  }
};