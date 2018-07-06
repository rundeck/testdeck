import {Context} from 'selenium/context'
import {CreateContext} from 'test/selenium'
import {LoginPage} from 'pages/login.page'
import {NavigationPage} from 'pages/navigation.page'

import {sleep} from 'async/util';
import 'test/rundeck'

// We will initialize and cleanup in the before/after methods
let ctx: Context
let loginPage: LoginPage
let navigation: NavigationPage

beforeAll( async () => {
    ctx = await CreateContext()
    loginPage = new LoginPage(ctx)
    navigation = new NavigationPage(ctx)
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

describe('expanded navigation bar', () => {
    beforeAll(async () => {
        await loginPage.login('admin', 'admin')
        await navigation.gotoProject('Sleep')
        await navigation.toggleSidebarExpand()
        await ctx.stabilizeScreenshot()
    })

    it('visits jobs', async () => {
        await navigation.visitJobs()
        await ctx.stabilizeScreenshot()
        const img = Buffer.from(await ctx.screenCap(), 'base64')
        expect(img).toMatchImageSnapshot({customSnapshotsDir: '__image_snapshots__', customDiffConfig: {threshold: 0.01}})
    })

    it('visits nodes', async () => {
        await navigation.visitNodes()
        await ctx.stabilizeScreenshot()
        const img = Buffer.from(await ctx.screenCap(), 'base64')
        expect(img).toMatchImageSnapshot({customSnapshotsDir: '__image_snapshots__', customDiffConfig: {threshold: 0.01}})
    })

    it('visits commands', async () => {
        await navigation.visitCommands()
        await ctx.stabilizeScreenshot()
        const img = Buffer.from(await ctx.screenCap(), 'base64')
        expect(img).toMatchImageSnapshot({customSnapshotsDir: '__image_snapshots__', customDiffConfig: {threshold: 0.01}})
    })

    it('visits activity', async () => {
        await navigation.visitActivity()
        await ctx.stabilizeScreenshot()
        await navigation.blur()
        const img = Buffer.from(await ctx.screenCap(), 'base64')
        expect(img).toMatchImageSnapshot({customSnapshotsDir: '__image_snapshots__', customDiffConfig: {threshold: 0.01}})
    })
})