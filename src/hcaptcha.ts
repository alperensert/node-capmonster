import { CapmonsterError, UAProxy } from "."

export class HCaptchaTask extends UAProxy {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (websiteUrl: string, websiteKey: string, isInvisible?: boolean,
        customData?: string, cookies?: string | Array<any> | object, noCache?: boolean) => {
            let newData: any[]
            let data = {
                clientKey: this.clientKey,
                task: {
                    type: "HCaptchaTask",
                    websiteURL: websiteUrl,
                    websiteKey: websiteKey
                }
            }
            newData = this.isProxyTask(data)
            if (typeof cookies !== "undefined") newData = await this.addCookies(cookies, newData[0])
            if (typeof isInvisible !== "undefined") newData[0].task.isInvisible = isInvisible
            if (typeof customData !== "undefined") {
                newData = this.addUserAgent(newData[0])
                if (newData[1] !== true) {
                    throw new CapmonsterError("USER_AGENT_ERROR", 
                    "You must provide an user agent if you submit captcha with custom_data")
                }
                newData[0].task.data = customData
            }
            if (typeof noCache !== "undefined") newData[0].task.nocache = noCache
            const task = await this.makeRequest("createTask", newData[0])
            return task.taskId
        }
}