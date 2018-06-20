import {Argv} from 'yargs'

import {spawn} from 'async/child-process'

interface Opts {
    url: string
    jest: string
}

class SeleniumCommand {
    command = "selenium"
    describe = "Run selenium test suite"

    builder(yargs: Argv) {
        return yargs
            .option("u", {
                alias: "url",
                default: "http://localhost:4440",
                describe: "Rundeck URL"
            })
            .option("j", {
                alias: "jest",
                describe: "Jest args",
                type: 'string'
            })
    }

    async handler(opts: Opts) {
        console.log(process.cwd())
        const args = `./node_modules/.bin/jest --testPathPattern='/selenium/' ${opts.jest}`
        console.log(args)
        const ret = await spawn('/bin/sh', ['-c', args], {stdio: 'inherit'})
        if (ret != 0)
            process.exitCode = 1
    }
}

module.exports = new SeleniumCommand()