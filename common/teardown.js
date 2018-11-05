// -- Global Teardown Routine -- //

// -- See: https://jestjs.io/docs/en/puppeteer -- //
// -- See: https://github.com/xfumihiro/jest-puppeteer-example -- //

const chalk = require("chalk");
const rimraf = require("rimraf");

const FN = require("../helpers/functions");

/* jshint ignore:start */
module.exports = async function() {
  
  console.log("");
  console.log(chalk.yellow("Tearing Down Puppeteer"));
  
  let err, nothing;
  
  if (global.__BROWSER_GLOBAL__) [err, nothing] = await FN.run(global.__BROWSER_GLOBAL__.close());
  if(err) {
    console.log(chalk.red(`Error Closing Browser:  ${JSON.stringify(err)}`));
  } else {
    rimraf.sync(FN.DIR);
    console.log(chalk.green("Closed: Headless Browser"));
    console.log("");
    console.log("  ", chalk.bgBlue.black("---------------------------------------"));
    console.log("  ", chalk.bgBlue.black(" "), "                                   ", chalk.bgBlue.black(" "));
		console.log("  ", chalk.bgBlue.black(" "), "           🎉 🐧 🐧 🐧 🎉          ", chalk.bgBlue.black(" "));
    console.log("  ", chalk.bgBlue.black(" "), "                                   ", chalk.bgBlue.black(" "));
    console.log("  ", chalk.bgBlue.black("---------------------------------------"));
    console.log("");
    console.log("");
}
  
}
/* jshint ignore:end */