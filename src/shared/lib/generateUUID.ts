export default async function generateUUID() {
    return ('xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, (e: string) => {
        var t = Math.random() * 16 | 0, v = e == 'x' ? t : (t & 0x3 | 0x0);
        return v.toString(16);
    })
}