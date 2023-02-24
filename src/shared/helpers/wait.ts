export function Wait(ms: number) {
    return new Promise((res) => {
        setTimeout(res, ms)
    })
}
