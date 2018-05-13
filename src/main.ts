import {EnvBuilder} from './env-builder'
import {Client} from './rundeck-client/client'
import {TestRepo} from './test-repo'
import {TestRunner} from './test-runner'

const DEFAULT_RD_URL = 'http://localhost:8080'
const DEFAULT_RD_USER = 'admin'
const DEFAULT_RD_PASSWORD = 'admin'

async function asyncMain() {
    process.env.RD_URL = DEFAULT_RD_URL
    process.env.RD_USER = DEFAULT_RD_USER
    process.env.RD_PASSWORD = DEFAULT_RD_PASSWORD

    const client = new Client({apiUrl: DEFAULT_RD_URL, username: DEFAULT_RD_USER, password: DEFAULT_RD_PASSWORD})

    const envBuilder = new EnvBuilder(client)

    console.log(`
Setting up test environment.
This can take a few minutes if the docker conatiner is not running.
Sit tight...\n
    `)
    await envBuilder.up()

    const testRepo = await TestRepo.CreateTestRepo('./tests')

    const testRunner = new TestRunner(testRepo)

    await testRunner.run()
}

asyncMain()