const CapmonsterClient = require("./CapmonsterClient")
const fs = require("fs")

module.exports = class ImageToTextTask extends CapmonsterClient {
    constructor(clientKey) {
        super(clientKey);
    }
    async createTask(file_path=null, base64_image=null, module=null) {
        let base64_img = null;
        if (file_path === null && base64_image === null) {
            return false;
        } else if (file_path !== null && base64_image !== null) {
            return false;
        }
        else if (file_path !== null) {
            base64_img = Buffer.from(fs.readFileSync(file_path)).toString("base64");
        } else if (base64_image !== null) {
            base64_img = base64_image
        } else {
            return false;
        }
        const data = {
            clientKey: this.CLIENT_KEY,
            task:
                {
                    type: "ImageToTextTask",
                    body: base64_img
                }
        }
        const task = await this.make_request("createTask", data)
        await this.checkResponse(task)
        return task.taskId
    }
    async getTaskResult(taskId) {
        const data = {
            clientKey: this.CLIENT_KEY,
            taskId: taskId
        }
        let task_result = await this.make_request("getTaskResult", data)
        await this.checkResponse(task_result)
        let is_ready = await this.checkReady(task_result)
        if (is_ready) {
            return task_result.solution.text;
        } else {
            return false;
        }
    }
    async joinTaskResult(taskId, maximum_time=150) {
        let i = 0
        while (i < maximum_time) {
            let is_ready = await this.getTaskResult(taskId)
            if (is_ready === false) {
                i += 1
                await this.timer(1000);
            } else {
                return is_ready;
            }
        }
        throw new Error(`Capmonster.cloud is so busy right now.`);
    }
}