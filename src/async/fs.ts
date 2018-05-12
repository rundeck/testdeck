import * as util from 'util'
import * as FS from 'fs'

export const readdir = util.promisify(FS.readdir)

export const stat = util.promisify(FS.stat)