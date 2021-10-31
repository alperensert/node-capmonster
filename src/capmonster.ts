import axios from "axios"

export class CapmonsterClient {
    public clientKey: string
    private balanceUrl: string = "/getBalance"
    private taskResultUrl: string = "/getTaskResult"
    private createTaskUrl: string = "/createTask"
    private hostUrl: string = "https://api.capmonster.cloud"
    private softId: number = 32

    constructor(clientKey: string) {
        this.clientKey = clientKey
    }

    public getBalance = async () => {
        const response = (await axios.post(this.hostUrl + this.balanceUrl, { clientKey: this.clientKey})).data
        await this.checkResponse(response)
        return response.balance
    }

    public getTaskResult = async (taskId: number) => {
        let data = {
            "clientKey": this.clientKey,
            "taskId": taskId
        }
        const result: any = await this.makeRequest("getTaskResult", data)
        const isReady: boolean = await this.isReady(result)
        if (isReady) {
            return result.solution
        } else {
            return false
        }
    }

    public joinTaskResult = async (taskId: number, maximumTime?: number) =>{
        let _maxTime: number
        _maxTime = maximumTime ? maximumTime : 120
        for (let i: number = 0; i <= _maxTime + 1; i += 2) {
            let result: any = await this.getTaskResult(taskId)
            if (result !== false) {
                return result
            } else {
                await this.timer(2000)
            }
        }
        throw new CapmonsterError("ERROR_MAXIMUM_TIME_EXCEED", "Maximum time is exceed.")
    }

    private timer = async (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected isReady = async (response: any) => {
        const status: string = response.status
        return status === "ready"
    }

    protected makeRequest = async (method: string, data: any) => {
        let _method: string = "getBalance"
        let response: any
        if (method === "getBalance") {
            _method = this.balanceUrl
        } else if (method === "getTaskResult") {
            _method = this.taskResultUrl
        } else if (method === "createTask") {
            _method = this.createTaskUrl
            data.softId = this.softId
        }
        try {
            response = (await axios.post(this.hostUrl + _method, data)).data
        }
        catch (e: any) {
            throw new CapmonsterError(e.name, e.message)
        }
        await this.checkResponse(response)
        return response
    }

    private checkResponse = async (response: any) => {
        if (response.errorId !== 0) {
            if (typeof response.errorDescription !== "undefined") response.errorDescription = ""
            throw new CapmonsterError(response.errorCode, response.errorDescription)
        }
    }

    protected addCookies = async (cookies: string | Array<any> | object, data: any) => {
        let str_cookies: string = ""
        if (typeof cookies === "string") {
            str_cookies = cookies
        } else if (Array.isArray(cookies)) {
            if (cookies.length % 2 != 0) throw new Error("Array cookies length must be even numbers")   
            for (let cookie of cookies) {
                str_cookies += cookies.indexOf(cookie) % 2 == 0 ? `${cookie}=` : `${cookie};`
            }
        } else if (typeof cookies === "object") {
            for (const [key, value] of Object.entries(cookies)) {
                str_cookies += `${key}=${value};`
            }
        }
        str_cookies = str_cookies.substr(str_cookies.length - 1) == ";" ? str_cookies.slice(0, -1) : str_cookies
        data.task.cookies = str_cookies
        return [data, true]
    }
}

export class CapmonsterError extends Error {
    code: string
    constructor(_code: string, msg: string) {
        super(`[${_code}] ${msg}`)
        this.name = this.constructor.name
        this.code = _code
    }
}

export class UAProxy extends CapmonsterClient {
    proxyType: any
    userAgent: string
    proxyAddress: string
    proxyPort: number
    proxyLogin: string
    proxyPassword: string

    constructor(clientKey: string) {
        super(clientKey)
    }

    public setUserAgent = (userAgent: string) => {
        this.userAgent = userAgent
    }

    public resetUserAgent = () => {
        this.userAgent = ""
    }

    protected addUserAgent = (data: any) => {
        if (this.userAgent) {
            data.task.userAgent = this.userAgent
            return [data, true]
        }
        return [data, false]
    }

    public setProxy = (proxyType: string, proxyAddress: string, proxyPort: number, 
        proxyLogin?: string, proxyPassword?: string) => {
            this.proxyType = proxyType
            this.proxyAddress = proxyAddress
            this.proxyPort = proxyPort
            this.proxyLogin = proxyLogin ? proxyLogin : ""
            this.proxyPassword = proxyPassword ? proxyPassword : ""
        }
    
    public disableProxy = () => {
        this.proxyType = ""
        this.proxyAddress = ""
        this.proxyPort = 0
        this.proxyLogin = ""
        this.proxyPassword = ""
    }

    protected isProxyTask = (data: any) => {
        if (this.proxyType && this.proxyAddress && this.proxyPort) {
            data.task.proxyType = this.proxyType
            data.task.proxyAddress = this.proxyAddress
            data.task.proxyPort = this.proxyPort

            if (this.proxyLogin && this.proxyPassword) {
                data.task.proxyLogin = this.proxyLogin
                data.task.proxyPassword = this.proxyPassword
            }
            return [data, true]
        }
        data.task.type += "Proxyless"
        return [data, false]
    }
}
