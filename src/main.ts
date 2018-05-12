import * as Path from 'path'

import chalk, { Chalk } from 'chalk'
import indent from 'indent-string'

import {exec} from './async/child-process'
import {TestRepo} from './test-repo'


async function asyncMain() {
    process.env.RD_URL = 'http://localhost:8080'
    process.env.RD_USER = 'admin'
    process.env.RD_PASSWORD = 'admin'

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
            } catch(e) {
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