import * as Url from 'url'

import {WebDriver, WebElement} from 'selenium-webdriver'
import {By, until} from 'selenium-webdriver'
import { version } from 'chromedriver';

export class Context {
    currentTestName!: string

    constructor(readonly driver: WebDriver, readonly baseUrl: string) {}

    urlFor(path: string) {
        return Url.resolve(this.baseUrl, path)
    }

    friendlyTestName() {
        return this.currentTestName.toLowerCase().replace(/ /g, '_')
    }

    async screenCap(stabilize = true) {
        if (stabilize)
        await this.stabilizeScreenshot()
        return await this.driver.takeScreenshot()
    }

    /** Toggles various settings to produce stable screenshots */
    async stabilizeScreenshot() {
        await Promise.all([
            this.hideSpinners(),
            this.hideVersionBox(),
            this.disableTransitions()
        ])
    }

    /** Hides version box for screenshots */
    async hideVersionBox() {
        const versionBox = await this.driver.findElement(By.className('snapshot-version'))
        await this.driver.executeScript((element: HTMLElement) => {
            element.style.setProperty('display', 'none')
        }, versionBox)
    }

    /** Hide spinners */
    async hideSpinners() {
        const spinners = await this.driver.executeScript<WebElement[]>(() => {
            let spinners = document.getElementsByClassName('loading-spinner')
                for (let elem of spinners) {
                    elem.remove()
                }
            return spinners
        })

        if (spinners.length > 0) {
            console.log(spinners)
            await this.driver.wait(until.stalenessOf(spinners[0]))
        }
    }

    /** Attempts to clear transitions, animations, and animated gifs from the page */
    async disableTransitions() {
        await this.driver.executeScript<WebElement[]>( () => {
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

    async dispose() {
        await this.driver.close()
    }
}