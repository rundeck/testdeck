import {Context} from 'selenium/context'

export abstract class Page {
    abstract path: string

    constructor(readonly ctx: Context) {}

    async get() {
        const {driver} = this.ctx
        await driver.get(this.ctx.urlFor(this.path))
    }
}