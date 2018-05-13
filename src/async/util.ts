export function sleep(ms: number): Promise<{}> {
    return new Promise( res => {
        setTimeout(res, ms)
    })
}