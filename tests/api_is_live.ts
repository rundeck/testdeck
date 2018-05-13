#!/usr/bin/env ts-node

import {Client} from '../src/rundeck-client/client'

async function main() {
    const c = new Client({apiUrl: 'http://localhost:8080', username: 'admin', password: 'admin'})
    const resp = await c.systemInfo()
    console.log(`System up since: ${resp.data.system.stats.uptime.since.datetime}`)
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})