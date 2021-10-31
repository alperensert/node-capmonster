import { CapmonsterClient } from "."

export class RecaptchaV3Task extends CapmonsterClient {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (websiteUrl: string, websiteKey: string, minimumScore?: number,
        pageAction?: string, noCache?: boolean) => {
            let data: any = {
                clientKey: this.clientKey,
                task: {
                    type: "RecaptchaV3TaskProxyless",
                    websiteURL: websiteUrl,
                    websiteKey: websiteKey
                }
            }
            if (typeof minimumScore !== "undefined" && minimumScore <= 0.9 && 0.1 <= minimumScore) {
                data.task.minScore = minimumScore
            } else {
                data.task.minScore = 0.3
            }
            if (typeof pageAction !== "undefined") data.task.pageAction = pageAction
            if (typeof noCache !== "undefined") data.task.nocache = noCache
            const task = await this.makeRequest("createTask", data)
            return task.taskId
        }
}