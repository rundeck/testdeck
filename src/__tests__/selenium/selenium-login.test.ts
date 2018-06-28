/**
 * I'm a selenium test, and I'm DRY because there is only one of me!
 */
import 'chromedriver'
import webdriver, {WebDriver} from 'selenium-webdriver'
import {Options} from 'selenium-webdriver/chrome'

import {Context, LoginPage} from 'pages/login.page'
import { sleep } from 'async/util';

jest.setTimeout(60000)

// We will initialize and cleanup in the before/after methods
let driver: WebDriver
let loginPage: LoginPage

beforeAll( async () => {
    const opts = new Options()

    if (process.env.CI)
        opts.addArguments('--headless')

    driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(opts)
        .build()

    loginPage = new LoginPage(new Context(driver, 'http://ubuntu:4440'))    
})

/**
 * Ensure driver is cleaned up.
 */
afterAll( async () => {
    await driver.close()
})

it('Logs in through the GUI', async () => {
    await loginPage.get()
    await loginPage.login('admin', 'admin')
})