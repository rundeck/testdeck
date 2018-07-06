import 'chromedriver'
import {Options} from 'selenium-webdriver/chrome'
import webdriver from 'selenium-webdriver'
import {toMatchImageSnapshot} from 'jest-image-snapshot'


import {Context} from 'selenium/context'

const opts = new Options()

jest.setTimeout(60000)

expect.extend({ toMatchImageSnapshot })

export async function CreateContext() {
    opts.addArguments('window-size=1200,1000')

    if (process.env.CI)
        opts.addArguments('--headless')

    let driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(opts)
        .build()

    // await driver.manage().window().setRect({height: 1000, width: 1200})

    let ctx = new Context(driver, 'http://ubuntu:4440')
    return ctx
}
