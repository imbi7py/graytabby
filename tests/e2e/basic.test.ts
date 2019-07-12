import * as fs from 'fs';
import * as webdriver from 'selenium-webdriver';
import {expect} from 'chai';
import {ThenableWebDriver} from "selenium-webdriver";

// skipping this test run until configuring headless chrome for travis CI
describe('Selenium Demo Test Suite', function () {
  let driver: ThenableWebDriver;
  // time out for test execution
  this.timeout(60000);

  before(function () {
    // initializing chrome driver
    driver = new webdriver.Builder()
      .forBrowser('firefox')
      .build();
    driver.manage().window().maximize();
  });

  after(function () {
    driver.quit();
  });

  it('should foo', async function () {
    await driver.get('https://www.google.com');
  });

});
