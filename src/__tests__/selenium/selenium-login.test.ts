import {Context} from 'selenium/context'
import {CreateContext} from 'test/selenium'
import {LoginPage} from 'pages/login.page'
import {sleep} from 'async/util';
import 'test/rundeck'

// We will initialize and cleanup in the before/after methods
let ctx: Context
let loginPage: LoginPage

beforeAll( async () => {
    ctx = await CreateContext()
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
    await ctx.dispose()
})

it('Logs in through the GUI', async () => {
    await loginPage.get()
    await loginPage.login('admin', 'admin')
    await ctx.disableTransitions()
    await sleep(1500)
    const img = Buffer.from((await ctx.driver.takeScreenshot()), 'base64')
    expect(img).toMatchImageSnapshot({customSnapshotsDir: '__image_snapshots__'})
})