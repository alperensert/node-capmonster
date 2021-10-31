import { CapmonsterClient } from "."

export class ImageToTextTask extends CapmonsterClient {
    constructor(clientKey: string) {
        super(clientKey)
    }

    public createTask = async (base64EncodedImage: string, module?: string, recognizingThreshold?: number,
        _case?: boolean, numeric?: number, math?: boolean) => {
            let data: any = {
                clientKey: this.clientKey,
                task: {
                    type: "ImageToTextTask",
                    body: base64EncodedImage
                }
            }
            if (typeof module !== "undefined") data.task.CapMonsterModule = module
            if (typeof recognizingThreshold !== "undefined") data.task.recognizingThreshold = recognizingThreshold
            if (typeof _case !== "undefined") data.task.Case = _case
            if (typeof numeric !== "undefined" && 0 <= numeric && numeric <= 1) data.task.numeric = numeric
            if (typeof math !== "undefined") data.task.math = math
            const task = await this.makeRequest("createTask", data)
            return task.taskId
        }
}