const chalk = require("chalk");
const twoFactor = require("node-2fa");
const FN = require("../helpers/functions");

var config = global.__CONFIG__, browser = global.__BROWSER__;

module.exports = (page, screenshot) => () => {
  
  let login;
  
  async function _login() {

    page = FN.value(page);
    
    await screenshot(page, "open", true);

    await FN.action("Wait for Log In Button", page, page.waitForSelector, "form#sign_in a.btn", {visible: true});

    await screenshot(page, "start", true);

    await FN.action("Click Log In Button", page, page.click, "form#sign_in a.btn");

    return new Promise((resolve, reject) => {

      async function _popup() {
    
        await page.waitFor(1000);

        try {

          let pages = await FN.action("Wait for Browser Pages 1", browser, browser.pages);

          if (pages && pages.length > 1) {

            login = pages[pages.length - 1];

            await FN.action("Wait for any redirects", login, login.waitForNavigation, {waitUntil: "networkidle0"});

            title = await FN.action("Wait for New Page Title 1", login, login.title);

            if (title && title.trim().toUpperCase() == "SIGN IN – GOOGLE ACCOUNTS") {

              if (config.debug) await login.tracing.start({path: trace_dir + "/trace.json"});

              login.on("console", msg => msg.args.forEach((item, index) => console.log(`LOGIN PAGE LOG -> ${index}: ${item}`)));
              login.on("pageerror", msg => console.log(`LOGIN PAGE PAGE ERROR -> ${msg}`));
              login.on("error", err => console.log(`LOGIN PAGE ERROR -> ${err}`));

              login.on("close", () => {
                console.log(chalk.bgGreen("Login Popup Closed"));
                login = null;
              });

              resolve(true);

            } else {

              console.log(chalk.red.bold(title ? "Unknown Page" : `Unknown Page Title: ${title}`));
              login = null;
              resolve(false);

            }

          } else {

            resolve(false);

          }

        } catch (e) {

          reject();

        }
        
      }
      
      FN.delay(4000).then(() => resolve(false));

      browser.once("targetcreated", _popup);

    });

  }
  
  async function _checkLogin() {
    
    expect.assertions(1);

    if (login) {

      await FN.action("Bring Login Screen to Front", login, login.bringToFront);

      let usr = await FN.action("Wait for Username Input on Login Page", login, login.waitForSelector, "div#profileIdentifier, input#Email, input#identifierId", {visible : true});
      
      await screenshot(login, "login_username");

      await FN.action("Type Email Address in Username Input", login, login.type, "input#Email, input#identifierId", config.user.email);

      await screenshot(login, "login_username_typed");

      await FN.action("Click Next", login, login.click, "input#next,div#identifierNext");

      await login.waitFor(500);

      await screenshot(login, "login_username_clicked");

      let pwd = await FN.action("Wait for Password Input on Login Page", login, login.waitForSelector, "div#captchaimg, img#captchaimg, input#Passwd, #password input[type='password']", {visible : true});

      let id = await pwd.getProperty("id");

      if (id == "captchaimg") {

        console.log(chalk.redBg("CAPTCHA TRIGGERED"));

        if (config.user.captcha) {

          await FN.action("Type Captcha Solution", login, login.type, "input#ca, input#ct", config.user.captcha);
          await login.type(String.fromCharCode(13));
          await FN.action("Wait for Password Input on Login Page", login, login.waitForSelector, "input#Passwd, #password input[type='password']", {visible : true});

        } else {

          throw new Error("CAPTCHA Solution Required, but none provided :(");

        }

      }

      await screenshot(login, "login_password");

      await FN.action("Type Password into Input", login, login.type, "input#Passwd, #password input[type='password']", config.user.password);

      await screenshot(login, "login_password_typed");

      await FN.action("Click Next", login, login.click, "input#signIn, div#passwordNext");

      await login.waitFor(500);

      await screenshot(login, "login_password_clicked");

      await FN.action("Wait for 2FA Code Input on Login Page", login, login.waitForSelector, "input#totpPin, input[name='totpPin'][type='tel']", {visible : true});

      await screenshot(login, "login_2FA");

      await FN.action("Type Code into 2FA Code Input", login, login.type, "input#totpPin, input[name='totpPin'][type='tel']", 
                                        config.user.code ? config.user.code : twoFactor.generateToken(config.user.key).token);

      await screenshot(login, "login_2FA_typed");

      await FN.action("Click Next", login, login.click, "input#submit, div#totpNext");

      await page.waitFor(1000); // Logon Delay

      if (login) {

        try {

          await FN.action("Wait for Consent (if required)", login, login.waitForSelector, "div#submit_approve_access", {visible : true});

          await screenshot(login, "consent");

          await FN.action("Click Agree", login, login.click, "div#submit_approve_access");

        } catch(e) {}

      }

      await FN.action("Bring App Screen to Front", page, page.bringToFront);

    }

    await FN.action("Wait for Log Out Button", page, page.waitForSelector, "form#sign_out a.btn", {visible: true});

    await page.waitFor(1000); // Animation Delay

    await screenshot(page, "authenticated", true);

    await page.waitForSelector("a#user_details");
    const user = await page.$eval("a#user_details", el => el.innerText);
    expect(user).toEqual(config.user.name);
    
  }
  
  async function _checkLogout() {
    
    expect.assertions(1);

    await FN.action("Wait for Log Out Button", page, page.waitForSelector, "form#sign_out a.btn", {visible: true});

    await FN.action("Click Log Out Button", page, page.click, "form#sign_out a.btn");

    await FN.action("Wait for Log In Button", page, page.waitForSelector, "form#sign_in a.btn", {visible: true});

    await page.waitFor(1000); // Animation Delay

    await screenshot(page, "end", true);

    await page.waitForSelector("form#sign_in a.btn span");
    const google = await page.$eval("form#sign_in a.btn span", el => el.innerText);
    expect(google).toEqual(expect.stringMatching(/Sign In/gi));
    
  }
  
  async function _complete(resolve, reject) {
    if (config.debug && login) await login.tracing.stop();
    resolve();
  }
  
  beforeAll(_login);

  it("Should log in", _checkLogin, 30000);

  it("Should log out", _checkLogout, 30000);

  afterAll(() => new Promise(_complete));
  
};