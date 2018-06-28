import * as Path from 'path'

import {WebDriver} from "selenium-webdriver"
import {By, until} from 'selenium-webdriver'

export enum Elems {
    username= '//*[@id="login"]',
    password = '//*[@id="password"]',
    /** @todo This button could use an id */
    loginBtn = '//button[text() = "Login"]',
}

export class Context {
    constructor(readonly driver: WebDriver, readonly baseUrl: string) {}

    urlFor(path: string) {
        return Path.join(this.baseUrl, path)
    }
}

export class LoginPage {
    constructor(readonly ctx: Context) {}

    async get() {
        const {driver} = this.ctx
        await driver.get(this.ctx.urlFor('/'))
    }

    async login(username: string, password: string) {
        const {driver} = this.ctx

        // Fetches the elements concurrently
        const [usernameFld, passwordFld, loginBtn] = await Promise.all([
            driver.findElement(By.xpath(Elems.username)),
            driver.findElement(By.xpath(Elems.password)),
            driver.findElement(By.xpath(Elems.loginBtn)),
        ])

        // Fills in the fields concurrently
        await Promise.all([
            usernameFld.sendKeys(username),
            passwordFld.sendKeys(password),
        ])

        await loginBtn.click()

        await driver.wait(until.titleMatches(/^Rundeck$/))
    }
}