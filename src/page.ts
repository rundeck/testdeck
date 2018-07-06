import {Context} from 'selenium/context'
import {By, until, WebElement} from 'selenium-webdriver'

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

    async screenshot(freeze = true) {
        if (freeze)
            await this.freeze()
        return await this.ctx.screenshot()
    }

    /** Attempt to freeze the page for stable screenshots */
    async freeze() {
        await Promise.all([
            this.hideSpinners(),
            this.hideVersionBox(),
            this.disableTransitions(),
            this.blur()
        ])
    }

    /** Hides version box for screenshots */
    async hideVersionBox() {
        const versionBox = await this.ctx.driver.findElement(By.className('snapshot-version'))
        await this.ctx.driver.executeScript((element: HTMLElement) => {
            element.style.setProperty('display', 'none')
        }, versionBox)
    }

    /** Hide spinners */
    async hideSpinners() {
        const spinners = await this.ctx.driver.executeScript<WebElement[]>(() => {
            let spinners = document.getElementsByClassName('loading-spinner')
                for (let elem of spinners) {
                    elem.remove()
                }
            return spinners
        })

        if (spinners.length > 0) {
            console.log(spinners)
            await this.ctx.driver.wait(until.stalenessOf(spinners[0]))
        }
    }

    /** Attempts to clear transitions, animations, and animated gifs from the page */
    async disableTransitions() {
        await this.ctx.driver.executeScript<WebElement[]>( () => {
            let styles = document.styleSheets
            let style = styles.item(0) as CSSStyleSheet
            if (style) {
                console.log(`Insterting no-transition rule into ${style.rules.item(0)!.cssText}`)
                style.insertRule(`.notransition * { 
                    -webkit-transition: none !important; 
                    -moz-transition: none !important; 
                    -o-transition: none !important; 
                    -ms-transition: none !important; 
                    transition: none !important; 
                }`, 0)
            }
            document.body.classList.add('notransition')
            let x = document.body.offsetHeight
        })
    }

    /** Blur the active element. Useful for hiding blinking cursor before screen cap. */
    async blur() {
        await this.ctx.driver.executeScript(() => {
            const elem = document.activeElement as HTMLElement
            elem.blur()
        })
    }
}