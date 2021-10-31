import { UAProxy } from "."

export class FuncaptchaTask extends UAProxy {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (websiteUrl: string, websitePublicKey: string, 
        apiJsSubdomain?: string, dataBlob?: string, cookies?: string | Array<any> | object, noCache?: boolean) => {
            let newData: any[]
            let data: any = {
                clientKey: this.clientKey,
                task: {
                    type: "FunCaptchaTask",
                    websiteURL: websiteUrl,
                    websitePublicKey: websitePublicKey
                }
            }
            if (typeof dataBlob !== "undefined") data.task.data = dataBlob
            if (typeof apiJsSubdomain !== "undefined") data.task.funcaptchaApiJSSubdomain = apiJsSubdomain
            newData = this.isProxyTask(data)
            if (newData[1]) {
                newData = this.addUserAgent(newData[0])
                if (typeof cookies !== "undefined") newData = await this.addCookies(cookies, newData[0])
            }
            if (typeof noCache !== "undefined") newData[0].task.nocache = noCache
            const task = await this.makeRequest("createTask", newData[0])
            return task.taskId
        }
}