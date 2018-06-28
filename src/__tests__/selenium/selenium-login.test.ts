/**
 * I'm a selenium test, and I'm DRY because there is only one of me!
 */
import 'chromedriver'
import webdriver, {WebDriver} from 'selenium-webdriver'
import {Options} from 'selenium-webdriver/chrome'

import {Context, LoginPage} from 'pages/login.page'
import { sleep } from 'async/util';
import 'test/rundeck'


jest.setTimeout(60000)

// We will initialize and cleanup in the before/after methods
let driver: WebDriver
let ctx: Context
let loginPage: LoginPage

beforeAll( async () => {
    const opts = new Options()

    if (process.env.CI)
        opts.addArguments('--headless')

    driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(opts)
        .build()

    ctx = new Context(driver, 'http://ubuntu:4440')
    loginPage = new LoginPage(ctx)
})

beforeEach( async () => {
    ctx.currentTestName = expect.getState().currentTestName
})

beforeEach( async () => {
    console.log(ctx.friendlyTestName())
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
    await sleep(500)
    const img = Buffer.from((await ctx.driver.takeScreenshot()), 'base64')
    expect(img).toMatchImageSnapshot({
        customSnapshotsDir: '__image_snapshots__',
        customDiffConfig: { threshold: 0.3 }
    })
})