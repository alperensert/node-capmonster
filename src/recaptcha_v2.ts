import { UAProxy } from "."

export class RecaptchaV2Task extends UAProxy {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (websiteUrl: string, websiteKey: string, cookies?: string | Array<any> | object,
        recaptchaSValue?: string, noCache?: boolean) => {
            let newData: any[]
            let data: any = {
                clientKey: this.clientKey,
                task: {
                    type: "NoCaptchaTask",
                    websiteURL: websiteUrl,
                    websiteKey: websiteKey
                }
            }
            newData = this.isProxyTask(data)
            newData = this.addUserAgent(newData[0])
            if (typeof cookies !== "undefined") newData = await this.addCookies(cookies, newData[0])
            if (typeof recaptchaSValue !== "undefined") newData[0].task.recaptchaDataSValue = recaptchaSValue
            if (typeof noCache !== "undefined") newData[0].task.nocache = noCache
            const task = await this.makeRequest("createTask", newData[0])
            return task.taskId
        }
}