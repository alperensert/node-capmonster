import { UAProxy } from "."

export class GeeTestTask extends UAProxy {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (websiteUrl: string, gt: string, challenge: string, 
        apiServerSubdomain?: string, getLib?: string) => {
            let newData: any[]
            let data:any = {
                clientKey: this.clientKey,
                task: {
                    type: "GeeTestTask",
                    websiteURL: websiteUrl,
                    gt: gt,
                    challenge: challenge
                }
            }
            newData = this.isProxyTask(data)
            newData = this.addUserAgent(newData[0])
            if (typeof apiServerSubdomain !== "undefined") newData[0].task.geetestApiServerSubdomain = apiServerSubdomain
            if (typeof getLib !== "undefined") newData[0].task.geetestGetLib = getLib
            const task = await this.makeRequest("createTask", newData[0])
            return task.taskId
        }
}