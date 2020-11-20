const axios = require("axios")

module.exports = class CapmonsterClient {
    constructor(clientKey) {
        this.CLIENT_KEY = clientKey;
        this.BALANCE_URL = "/getBalance"
        this.TASK_RESULT_URL = "/getTaskResult"
        this.CREATE_TASK_URL = "/createTask"
        this.CAPMONSTER_URL = "https://api.capmonster.cloud"
        this.SOFT_ID = 32
    }
    async getBalance() {
        const response = (await axios.post(this.CAPMONSTER_URL + this.BALANCE_URL, {
            clientKey: this.CLIENT_KEY
        })).data;
        if (response["errorId"] !== 0) {
            throw new Error(`${response.errorId} - ${response.errorCode} - ${response.errorDescription}`)
        } else {
            return parseFloat(response.balance);
        }
    }
    async checkResponse(response) {
        if (response.errorId !== 0) {
            throw new Error(`${response.errorId} - ${response.errorCode} - ${response.errorDescription}`)
        } else {
            return true;
        }
    }
    async checkReady(response) {
        let status = response.status;
        if (status === "processing") {
            return false;
        } else return status === "ready";
    }
    async make_request(method, data) {
        if (typeof method === "string") {
            if (method === "getBalance") {
                method = this.BALANCE_URL
            } else if (method === "getTaskResult") {
                method = this.TASK_RESULT_URL
            } else if (method === "createTask") {
                method = this.CREATE_TASK_URL
                data.softId = this.SOFT_ID
            }
            try {
                return (await axios.post(this.CAPMONSTER_URL + method, data)).data
            } catch {
                throw new Error(`Capmonster.cloud returned 0 bytes.`);
            }
        } else {
            throw new Error(`-1 # -1 # -1`)
        }
    }
    async timer(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}