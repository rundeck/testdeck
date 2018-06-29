import * as Path from 'path'

import {WebDriver, WebElement} from 'selenium-webdriver'
import {until} from 'selenium-webdriver'

export class Context {
    currentTestName!: string

    constructor(readonly driver: WebDriver, readonly baseUrl: string) {}

    urlFor(path: string) {
        return Path.join(this.baseUrl, path)
    }

    friendlyTestName() {
        return this.currentTestName.toLowerCase().replace(/ /g, '_')
    }

    /**
     * Attempts to clear transitions, animations, and animated gifs from the page
     */
    async disableTransitions() {
        let spinners = await this.driver.executeScript<WebElement[]>( () => {
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
            let spinners = document.getElementsByClassName('loading-spinner')
                for (let elem of spinners) {
                    elem.remove()
                }
            let x = document.body.offsetHeight
            return spinners
        })
        if (spinners.length > 0) {
            console.log(spinners)
            await this.driver.wait(until.stalenessOf(spinners[0]))
        }
    }

    async dispose() {
        await this.driver.close()
    }
}