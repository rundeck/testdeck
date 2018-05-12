import * as FS from 'fs'
import * as util from 'util'

export const readdir = util.promisify(FS.readdir)

export const stat = util.promisify(FS.stat)