import {Client} from '../src/rundeck-client/client'

it('Is running Oracle JVM', async () => {
    const client = new Client({apiUrl: 'http://localhost:8080', username: 'admin', password: 'admin'})
    const resp = await client.systemInfo()
    expect(resp.data.system.jvm.vendor).toBe('Oracle Corporation')
})