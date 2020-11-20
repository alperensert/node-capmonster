const CapmonsterClient = require("./CapmonsterClient")

module.exports = class NoCaptchaTaskProxyless extends CapmonsterClient {
    constructor(clientKey) {
        super(clientKey);
    }
    async createTask(website_key, website_url, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.132 Safari/537.36") {
        const data = {
            clientKey: this.CLIENT_KEY,
            task: {
                type: "NoCaptchaTaskProxyless",
                websiteURL: website_url,
                websiteKey: website_key,
                userAgent: user_agent
            }
        }
        const task = await this.make_request("createTask", data)
        await this.checkResponse(task)
        return task.taskId;
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
            return task_result.solution.gRecaptchaResponse;
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