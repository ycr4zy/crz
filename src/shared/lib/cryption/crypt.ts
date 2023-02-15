class Crypt {

    private _n: number = 7425

    constructor() {
    }

    public encrypt(str: string, key: string = ''): string {
        return this._crypt(str, key, 1)
    }

    public decrypt(encryptedStr: string, key: string = ''): string {
        return this._crypt(encryptedStr, key, -1)
    }

    public compare(str: string, encryptedStr: string, key: string = ''): boolean {
        return str === this.decrypt(encryptedStr, key)
    }

    private _appendKey(str: string, key: string): string {
        let appendKey = ''
        if (key) {
            while (appendKey.length < str.length) {
                appendKey += key
            }
        } else {
            for (let i = 0; i < str.length; i++) {
                appendKey += 'A'
            }
        }
        return appendKey.slice(0, str.length)
    }

    private _encodeStr(str: string): Array<number> {
        return str.split('').map(char => char.charCodeAt(0))
    }

    private _decodeStr(codeStr: Array<number>): string {
        return String.fromCharCode(...codeStr)
    }

    private _summarizeEncodedStrs(encodedStr: Array<number>, encodedAppendedKey: Array<number>): Array<number> {
        const summarizedEncodedKey = []
        for (let i = 0; i < encodedStr.length; i++) {
            summarizedEncodedKey.push((encodedStr[i] + encodedAppendedKey[i]) % this._n)
        }
        return summarizedEncodedKey
    }

    private _crypt(str: string, key: string, cryptCode: 1 | -1): string {
        const appendedKey = this._appendKey(str, key)
        const encodedStr = this._encodeStr(str)
        const encodedAppendedKey = this._encodeStr(appendedKey)
        const summaryEncodedKey = this._summarizeEncodedStrs(encodedStr, encodedAppendedKey.map(codedChar => codedChar * cryptCode))

        return this._decodeStr(summaryEncodedKey)
    }
}


export default new Crypt()