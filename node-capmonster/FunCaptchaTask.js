const CapmonsterClient = require("./CapmonsterClient")

module.exports = class FunCaptchaTask extends CapmonsterClient {
    constructor(clientKey) {
        super(clientKey);
    }
    async createTask(website_public_key,
                     website_url,
                     proxyAddress,
                     proxyPort,
                     proxyLogin,
                     proxyPassword,
                     proxyType="https",
                     js_subdomain=null,
                     data_blob=null) {
        const data = {
            clientKey: this.CLIENT_KEY,
            task: {
                type: "FunCaptchaTask",
                websiteURL: website_url,
                websitePublicKey: website_public_key,
                proxyType: proxyType,
                proxyAddress: proxyAddress,
                proxyPort: proxyPort,
                proxyLogin: proxyLogin,
                proxyPassword: proxyPassword,
            }
        }
        if (js_subdomain !== null) data.task.funcaptchaApiJSSubdomain = js_subdomain
        if (data_blob !== null) data.task.data = data_blob
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
            return task_result.solution.token;
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