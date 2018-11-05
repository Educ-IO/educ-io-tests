const FN = require("../helpers/functions");

var config = global.__CONFIG__, browser = global.__BROWSER__;

module.exports = (page, screenshot) => () => {
  
  async function _checkPublic() {
    
    var CONTENT = "div#content div.container, div#content div.container-fluid";
    
    expect.assertions(2);
       
    await FN.action("Wait for Get Started Button", page, page.waitForSelector, `${CONTENT} a.btn.btn-action`, {visible: true});

    await FN.action("Wait for Lead Content", page, page.waitForSelector, `${CONTENT} .lead`, {visible: true});

    const content = await page.$eval(`${CONTENT} .lead`, el => el.innerText);
    expect(content).toEqual(expect.anything());
    expect(content.length).toBeGreaterThanOrEqual(10);

    await FN.action("Click Log In Button", page, page.click, "div#content div.container a.btn.btn-action");
    
  }
  
  async function _checkPrivate() {
    
    var CONTENT = "div#content div.container, div#content div.container-fluid";
    
    expect.assertions(2);

    await FN.action("Wait for Log Out Button", page, page.waitForSelector, "form#sign_out a.btn", {visible: true});

    await FN.action("Wait for Lead Content", page, page.waitForSelector, `${CONTENT} .lead`, {visible: true});

    const content = await page.$eval(`${CONTENT} .lead`, el => el.innerText);
    expect(content).toEqual(expect.anything());
    expect(content.length).toBeGreaterThanOrEqual(10);

    await FN.action("Click Log Out Button", page, page.click, "form#sign_out a.btn");
    
  }
  
  beforeAll(() => page = FN.value(page));
  
  it("Should have public (un-authenticated) content", _checkPublic, 30000);
    
  it("Should have readme (authenticated) content", _checkPrivate, 30000);
  
}