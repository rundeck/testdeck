import * as Url from 'url'

import {WebDriver} from 'selenium-webdriver'

export class Context {
    currentTestName!: string

    constructor(readonly driver: WebDriver, readonly baseUrl: string) {}

    urlFor(path: string) {
        return Url.resolve(this.baseUrl, path)
    }

    friendlyTestName() {
        return this.currentTestName.toLowerCase().replace(/ /g, '_')
    }

    async screenshot() {
        return await this.driver.takeScreenshot()
    }

    async dispose() {
        await this.driver.close()
    }
}