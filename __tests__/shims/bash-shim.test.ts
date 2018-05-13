import {exec} from '../../src/async/child-process'

/**
 * I'm a Jest script shim!
 */

it('Returns user list', async () => {
    const result = await exec('./tests/bash_tests/users.bash')
    // Let's print the output to the console!
    console.log(result.stdout)
})