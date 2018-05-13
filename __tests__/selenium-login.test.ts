/**
 * I'm a selenium test, and I'm DRY because there is only one of me!
 */
import 'chromedriver'
import webdriver, {WebDriver} from 'selenium-webdriver'
import {By, until} from 'selenium-webdriver'
import { sleep } from '../src/async/util'

enum Elems {
    username= '//*[@id="login"]',
    password = '//*[@id="password"]',
    /** @todo This button could use an id */
    loginBtn = '//*[@id="loginpage"]/div[1]/div/div/div/form/div[3]/button',
}

let driver: WebDriver

beforeAll( async () => {
    driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .build()
})

/**
 * Ensure driver is cleaned up.
 */
afterAll( async () => {
    await driver.close()
})

it('Logs in through the GUI', async () => {
    jest.setTimeout(15000)

    await driver.get('http://localhost:8080')

    const [username, password, loginBtn] = await Promise.all([
        driver.findElement(By.xpath(Elems.username)),
        driver.findElement(By.xpath(Elems.password)),
        driver.findElement(By.xpath(Elems.loginBtn)),
    ])

    await Promise.all([
        username.sendKeys('admin'),
        password.sendKeys('admin'),
    ])

    await loginBtn.click()

    await driver.wait(until.titleMatches(/^Rundeck$/))
 })