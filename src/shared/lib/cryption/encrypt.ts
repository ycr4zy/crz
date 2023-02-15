import key from "./key";


export default async function encDec(action: "encrypt" | "decrypt", message: string): Promise<number[] | string> {

    let resultArr: number[] = [], resultStr: string = '';

    if (action === "encrypt")
        for (var i = 0; i < message.length; i++) {
            const tmp = message.charCodeAt(i);
            resultArr.push(tmp ^ key);
        }
    else {
        let tmpStrArr: string[] = message.replace("[", "").replace("]", "").split(",")
        let tmpNumArr: number[] = [];

        for (let i = 0; i < tmpStrArr.length; i++) {
            tmpNumArr[i] = +(tmpStrArr[i]);
            console.log(tmpStrArr[i])
        }

        for (let j = 0; j < tmpNumArr.length; j++) {
            const tmp = tmpNumArr[j] ^ key;
            console.log(String.fromCharCode(tmp))
            resultStr += String.fromCharCode(tmp);
        }

    }

    return resultStr ? resultStr : resultArr;
}