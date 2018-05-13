import * as Path from 'path'

import Axios from 'axios'
import chalk, { Chalk } from 'chalk'
import indent from 'indent-string'

import {exec} from './async/child-process'
import {EnvBuilder} from './env-builder'
import {Client} from './rundeck-client/client'
import {TestRepo} from './test-repo'

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

    for (const group of testRepo.groups) {
        for (const test of group.tests) {
            let stdout = ''
            let stderr = ''

            try {
                const res = await exec(test.file)
                console.log(`${chalk.green('✔️')} ${test.name}`)
                stdout = res.stdout
                stderr = res.stderr
            } catch (e) {
                console.log(`${chalk.red('❌')} ${test.name} ${test.file}`)
                stdout = e.stdout
                stderr = e.stderr
            } finally {
                if (stdout != '')
                    console.log(indent(`stdout:\n${indent(stdout, 4)}`, 4))
                if (stderr != '')
                    console.log(indent(`stderr:\n${indent(chalk.red(stderr), 4)}`, 4))
            }
        }
    }
}

asyncMain()