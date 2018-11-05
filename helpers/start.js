const FN = require("../helpers/functions");

module.exports = (page, url) => {
  
  async function _load() {
    page = FN.value(page);
  	url = FN.value(url);
  	await FN.action(`Navigating to ${url}`, page, page.goto, url, {waitUntil : "networkidle0"});
  	await page.waitFor(1000);
  }
  
  return _load;
  
};