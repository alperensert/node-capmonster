const CapmonsterClient = require("./CapmonsterClient")

module.exports = class RecaptchaV3TaskProxyless extends CapmonsterClient {
    constructor(clientKey) {
        super(clientKey);
    }
    async createTask(website_key, website_url, minimum_score=0.3, page_action="verify") {
        if (!(0.9 >= minimum_score >= 0.1)) throw new Error("Minimum score must be between 0.1 and 0.99")
        const data = {
            clientKey: this.CLIENT_KEY,
            task: {
                type: "RecaptchaV3TaskProxyless",
                websiteURL: website_url,
                websiteKey: website_key,
                minScore: minimum_score,
                pageAction: page_action
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