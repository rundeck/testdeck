import {Stats} from 'fs'
import * as FS from './async/fs'
import * as Path from 'path'

interface Test {
    name: string
    file: string
}

interface TestGroup {
    name: string
    tests: Test[]
}

/**
 * Represents the discovered test folder.
 */
export class TestRepo {
    /** Returns a TestRepo constructed from the supplied path. */
    static async CreateTestRepo(path: string): Promise<TestRepo> {
        const absPath = Path.resolve(path)

        const groups = await this._loadRepo(absPath)

        return new TestRepo(groups)
    }

    private static async _loadRepo(path: string): Promise<TestGroup[]> {
        const dirContents = await this._dirContents(path)

        const dirStats = await this._statFiles(dirContents)

        const dirs = await dirStats.filter( e => e.stats.isDirectory() )

        const groupProms = dirs.map( d => this._loadRepoFolder(d.file) )

        groupProms.push(this._loadRepoFolder(path, 'main'))

        return await Promise.all(groupProms)
    }

    private static async _loadRepoFolder(path: string, groupName?: string): Promise<TestGroup> {
        groupName = groupName ? groupName : path.split(Path.sep).pop()!

        const dirContents = (await FS.readdir(path)).map( f => Path.join(path, f))

        const dirStats = (
            await Promise.all(dirContents.map(f => FS.stat(f)))
        ).map( (s, i) => ({file: dirContents[i], stats: s}) )

        const testEntries = dirStats.filter( e => e.stats.isFile() )

        const tests = testEntries.map( t => ({file: t.file, name: Path.basename(t.file).split('.').shift()!}) )
    
        return {
            name: groupName,
            tests,
        }
    }

    private static async _dirContents(path: string): Promise<string[]> {
        return (await FS.readdir(path)).map( f => Path.join(path, f))
    }

    private static async _statFiles(paths: string[]): Promise<Array<{file: string, stats: Stats}>> {
        return (
            await Promise.all(paths.map(f => FS.stat(f)))
        ).map( (s, i) => ({file: paths[i], stats: s}) )
    }

    constructor(readonly groups: TestGroup[]) {}
}