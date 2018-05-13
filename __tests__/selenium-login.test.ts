/**
 * I'm a selenium test, and I'm DRY because there is only one of me!
 */
import 'chromedriver'
import webdriver, {WebDriver} from 'selenium-webdriver'
import {By, until} from 'selenium-webdriver'
import {Options} from 'selenium-webdriver/chrome'

jest.setTimeout(15000)

enum Elems {
    username= '//*[@id="login"]',
    password = '//*[@id="password"]',
    /** @todo This button could use an id */
    loginBtn = '//*[@id="loginpage"]/div[1]/div/div/div/form/div[3]/button',
}

// We will initialize and cleanup in the before/after methods
let driver: WebDriver

beforeAll( async () => {
    const opts = new Options()

    if (process.env.CI)
        opts.addArguments('--headless')

    driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(opts)
        .build()
})

/**
 * Ensure driver is cleaned up.
 */
afterAll( async () => {
    await driver.close()
})

it('Logs in through the GUI', async () => {
    await driver.get('http://localhost:8080')

    // Fetches the elements concurrently
    const [username, password, loginBtn] = await Promise.all([
        driver.findElement(By.xpath(Elems.username)),
        driver.findElement(By.xpath(Elems.password)),
        driver.findElement(By.xpath(Elems.loginBtn)),
    ])

    // Fills in the fields concurrently
    await Promise.all([
        username.sendKeys('admin'),
        password.sendKeys('admin'),
    ])

    await loginBtn.click()

    await driver.wait(until.titleMatches(/^Rundeck$/))
})