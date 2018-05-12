import * as util from 'util'
import * as CP from 'child_process'

export const exec = util.promisify(CP.exec)