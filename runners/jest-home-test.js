const FN = require("../helpers/functions");
const SIMPLE = require("../tests/simple");

const APP = "home", DIR = {
  output: `outputs/${APP}`,
  trace: `traces/${APP}`
};

var config = global.__CONFIG__, url = `https://${config.site}`;
let page, screenshot = FN.screenshot(DIR.output);

// -- Set-Up Methods -- //
/* jshint ignore:start */
beforeAll(async () => page = await FN.setup(DIR));
/* jshint ignore:end */

/* jshint ignore:start */
describe("Testing the Home Page", async () => {
  
  beforeAll(require("../helpers/start")(() => page, url));
  
  test("Title is correct", SIMPLE.title(() => page, "Home | Educ.IO"));
  
  test("Apps Link", SIMPLE.link(() => page, ".lead a.btn.btn-primary", `${url}/#apps`));
  
  test("Support Link", SIMPLE.link(() => page, ".lead a.btn.btn-success", `${url}/support/`));
  
  test("About Link", SIMPLE.link(() => page, ".lead a.btn.btn-normal", `${url}/about/`));
  
  test("Has Headlines", SIMPLE.countMoreThan(() => page, ".carousel .carousel-inner > div.carousel-item", 1));
  
  test("Has List of Apps", SIMPLE.countMoreThan(() => page, ".d-flex.flex-row > div.flex-column", 5));
  
  test("Has Correct Apps", SIMPLE.containsTextValues(() => page, ".d-flex.flex-row div.flex-column > div h3", ["View", "Folders", "Docket", "Gabriel", "Tag-a-Doc"]));
  
  test("Has Page Scroll", async () => {
    
    expect.assertions(3);
    
    const first_App = await page.$("#apps div.flex-column");
    
    await screenshot(page, "main");
    
    expect(await first_App.isIntersectingViewport()).toBeFalsy();
    
    await page.evaluate(() => document.querySelector("a[href='#apps']").click());
    
    await page.waitFor(1000);
    
    await screenshot(page, "apps");
    
    expect(await first_App.isIntersectingViewport()).toBeTruthy();
    
    await page.evaluate( () => window.scrollBy(0, 0-window.innerHeight));
    
    expect(await first_App.isIntersectingViewport()).toBeFalsy();
    
  });
  
  afterAll(() => page ? page.close() : true);
  
});
/* jshint ignore:end */