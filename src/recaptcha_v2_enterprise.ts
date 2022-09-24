import { UAProxy } from "."

export class RecaptchaV2EnterpriseTask extends UAProxy {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (websiteUrl: string, websiteKey: string, cookies?: string | Array<any> | object,
        enterprisePayload?: string | object, apiDomain?: string, noCache?: boolean) => {
            let newData: any[]
            let data: any = {
                clientKey: this.clientKey,
                task: {
                    type: "RecaptchaV2EnterpriseTask",
                    websiteURL: websiteUrl,
                    websiteKey: websiteKey
                }
            }
            newData = this.isProxyTask(data)
            newData = this.addUserAgent(newData[0])
            if (typeof cookies !== "undefined") newData = await this.addCookies(cookies, newData[0])
            if (typeof apiDomain !== "undefined") newData[0].task.apiDomain = apiDomain
            if (typeof enterprisePayload !== "undefined") newData[0].task.enterprisePayload = enterprisePayload
            if (typeof noCache !== "undefined") newData[0].task.nocache = noCache
            const task = await this.makeRequest("createTask", newData[0])
            return task.taskId
        }
}