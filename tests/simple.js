// -- Test Setup Routine -- //
const FN = require("../helpers/functions");

module.exports = {
  
  equalsText : (page, selector, value) => {
    return async function equalsText() {
      expect.assertions(1);
      const text = await FN.value(page).$eval(FN.value(selector), el => el.innerText);
    	expect(text).toEqual(expect.stringMatching(FN.value(value)));
    }
  },
  
  containsTextValues : (page, selector, values) => {
    return async function containsTextValues() {
      expect.assertions(1);
      const text = await FN.value(page).$$eval(FN.value(selector), elements => elements.map(element => element.textContent.trim()));
      expect(text).toEqual(expect.arrayContaining(FN.value(values)));
    }
  },
  
  countEqual : (page, selector, value) => {
    return async function countEqual() {
      expect.assertions(1);
      const count = await FN.value(page).$$eval(FN.value(selector), el => el.length);
    	expect(count).toEqual(FN.value(value));
    }
  },
  
  countLessThan : (page, selector, value) => {
    return async function countLessThan() {
      expect.assertions(1);
      const count = await FN.value(page).$$eval(FN.value(selector), el => el.length);
    	expect(count).toBeLessThan(FN.value(value));
    }
  },
  
  countMoreThan : (page, selector, value) => {
    return async function countMoreThan() {
      expect.assertions(1);
      const count = await FN.value(page).$$eval(FN.value(selector), el => el.length);
    	expect(count).toBeGreaterThan(FN.value(value));
    }
  },
  
  link : (page, selector, value) => {
    return async function link() {
      expect.assertions(1);
      const canonical = await FN.value(page).$eval(FN.value(selector), el => el.href);
    	expect(canonical).toEqual(FN.value(value));
    }
  },
  
  title : (page, value) => {
    return async function title() {
      expect.assertions(1);
      const title = await FN.value(page).title();
      expect(title.trim()).toBe(FN.value(value));
    }
  }
  
};