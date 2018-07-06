import {Context} from 'selenium/context'
import {By} from 'selenium-webdriver'

export abstract class Page {
    abstract path: string

    constructor(readonly ctx: Context) {}

    async get() {
        const {driver} = this.ctx
        await driver.get(this.ctx.urlFor(this.path))
    }

    async clickBy(by: By) {
        const {driver} = this.ctx
        const elem = await driver.findElement(by)
        await elem.click()
    }

    /** Blur the active element. Useful for hiding blinking cursor before screen cap. */
    async blur() {
        await this.ctx.driver.executeScript(() => {
            const elem = document.activeElement as HTMLElement
            elem.blur()
        })
    }
}