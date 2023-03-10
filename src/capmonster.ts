/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosInstance } from "axios"
import { CapmonsterError } from "./capmonster_error"

export class CapmonsterClient {
    clientKey: string
    private static hostUrl = "https://api.capmonster.cloud"
    private static balanceUrl = "/getBalance"
    private static createTaskUrl = "/createTask"
    private static taskResultUrl = "/getTaskResult"
    private callbackUrl?: string
    private request: AxiosInstance
    private timeout = 120

    /**
     * Initialize a new capmonster client for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        this.clientKey = clientKey
        this.request = axios.create({
            baseURL: CapmonsterClient.hostUrl,
            validateStatus: (status) => {
                return (
                    (status >= 200 && status < 300) ||
                    (status >= 400 && status < 500)
                )
            },
        })
    }

    /**
     * @returns Balance of your account
     */
    public getBalance = async (): Promise<number> => {
        const requestData: Pick<IRequest, "clientKey"> = {
            clientKey: this.clientKey,
        }
        const response = await this.request.post<Omit<IResponse, "taskId">>(
            CapmonsterClient.balanceUrl,
            requestData
        )
        this.checkResponse(response.data)
        return (response.data as WithRequired<typeof response.data, "balance">)
            .balance
    }

    /**
     * Convert cookies to string
     * @param cookies Your cookies as a object
     * @since v0.4
     */
    public convertCookies = (cookies: {
        [key: string]: string | number | boolean
    }): string => {
        let _cookies = ""
        for (const [key, value] of Object.entries(cookies)) {
            _cookies += `${key}=${value};`
        }
        return _cookies.slice(0, -1)
    }

    /**
     * Sets the callback url for all tasks, globally.
     *
     *
     * Contents are sent by POST
     * request and are same to the contents. of getTaskResult method. The content of the response
     * is not checked and you must  accept the request in
     * 2 seconds then the connection will be closed.
     * @param url Web address where we will send result of captcha task processing.
     */
    public setCallbackUrl = (url: string): void => {
        this.callbackUrl = url
    }

    /**
     * Unset the callback url for all tasks, globally.
     */
    public unsetCallbackUrl = (): void => (this.callbackUrl = undefined)

    /**
     * Sets the timeout for the entire client.
     * @param timeout As seconds, must between 1 and 300.
     */
    public setTimeout = (timeout: number) => {
        if (timeout > 0 && timeout <= 300) this.timeout = timeout
    }

    protected _createTask = async <T extends ITask>(task: T) => {
        const realData: ITaskRequest<T> & { softId: number } = {
            softId: 32,
            task,
            callbackUrl: this.callbackUrl,
            clientKey: this.clientKey,
        }
        const { data: d } = await this.request.post<
            Omit<IResponse, "balance" | "status">
        >(CapmonsterClient.createTaskUrl, realData)
        this.checkResponse(d)
        return d.taskId!
    }

    protected _getTaskResult = async <T extends ITaskSolution>(
        taskId: number
    ): Promise<T | null> => {
        const requestData: Omit<IRequest, "callbackUrl"> = {
            clientKey: this.clientKey,
            taskId: taskId,
        }
        const { data } = await this.request.post<
            WithRequired<ITaskResponse<T>, "status">
        >(CapmonsterClient.taskResultUrl, requestData)
        this.checkResponse(data)
        return this.isReady(data) ? data.solution : null
    }

    protected _joinTaskResult = async <T extends ITaskSolution>(
        taskId: number,
        timeout?: number
    ) => {
        const _timeout =
            timeout && timeout <= 300 && timeout > 0 ? timeout : this.timeout
        for (let i = 0; i <= _timeout + 1; i += 2) {
            const result = await this._getTaskResult<T>(taskId)
            if (result !== null) return result
            await this.timer(2000)
        }
        throw new CapmonsterError({
            errorId: -1,
            errorCode: "ERROR_MAXIMUM_TIME_EXCEED",
            errorDescription: "Maximum time is exceed",
        })
    }

    /**
     * @param cookies An array, object or string.
     */
    protected addCookies = (cookies: string | Array<unknown> | object) => {
        let str_cookies = ""
        if (typeof cookies === "string") {
            str_cookies = cookies
        } else if (Array.isArray(cookies)) {
            if (cookies.length % 2 != 0)
                throw Error("Array cookies length must be even numbers")
            cookies.forEach((v, i) => {
                str_cookies += i % 2 == 0 ? `${v}=` : `${v};`
            })
        } else if (typeof cookies === "object") {
            for (const [key, value] of Object.entries(cookies)) {
                str_cookies += `${key}=${value};`
            }
        }
        return str_cookies.slice(-1) == ";"
            ? str_cookies.slice(0, -1)
            : str_cookies
    }

    protected isReady = <
        K extends ITaskSolution,
        T extends WithRequired<ITaskResponse<K>, "status">
    >(
        response: T
    ): response is WithRequired<T, "solution"> => response.status === "ready"

    private timer = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    private checkResponse = <T extends IErrorResponse>(response: T): void => {
        if (response.errorId === 0) return
        throw new CapmonsterError(response)
    }
}

export class UAProxy extends CapmonsterClient {
    protected proxy: IProxyTaskRequest = {}
    protected userAgent: IUserAgentTaskRequest = {}

    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Sets a global user agent for using in tasks which supports user agent
     * @param userAgent Browser's User-Agent which is used in emulation.
     */
    public setUserAgent = (userAgent: string): void => {
        this.userAgent = {
            userAgent,
        }
    }

    /**
     * Resets the global user agent if any.
     * @deprecated since v0.4
     */
    public resetUserAgent = (): void => {
        console.warn(
            "This function is deprecated, use `unsetUserAgent` to avoid errors in future versions"
        )
        this.userAgent = {}
    }

    /**
     * Resets the global user agent if any.
     */
    public unsetUserAgent = (): void => {
        this.userAgent = {}
    }

    /**
     * Sets the proxy for using in tasks which supports.
     * @param proxyType Type of the proxy
     * @param proxyAddress Proxy IP address IPv4/IPv6
     * @param proxyPort Proxy port
     * @param proxyLogin Login for proxy which requires authorizaiton (basic)
     * @param proxyPassword Proxy password
     * @deprecated since v0.4 - use `setGlobalProxy`
     */
    public setProxy = (
        proxyType: ProxyType,
        proxyAddress: string,
        proxyPort: number,
        proxyLogin?: string,
        proxyPassword?: string
    ): void => {
        console.warn(
            "This function is deprecated, use `setGlobalProxy` to avoid errors in future versions"
        )
        this.proxy = {
            proxyType,
            proxyPort,
            proxyAddress,
            proxyLogin,
            proxyPassword,
        }
    }

    /**
     * Sets the proxy for using in tasks which supports.
     * @param proxy Proxy
     * @since v0.4
     */
    public setGlobalProxy = (
        proxy: WithRequired<
            IProxyTaskRequest,
            "proxyType" | "proxyAddress" | "proxyPort"
        >
    ) => (this.proxy = proxy)

    /**
     * Disables (by deleting the proxy instance) proxy.
     * @deprecated since v0.4 - use `resetProxy` instead
     */
    public disableProxy = (): void => {
        console.warn(
            "This function is deprecated, use `resetProxy` to avoid errors in future versions"
        )
        this.proxy = {}
    }

    /**
     * Resets the proxy if any
     * @since v0.4
     */
    public unsetProxy = (): void => {
        this.proxy = {}
    }

    protected isUserAgentTask = <T extends ITask>(
        data: T
    ): [(T & IUserAgentTaskRequest) | T, boolean] => {
        if (this.userAgent.userAgent !== undefined) {
            const dataWithUserAgent: T & IUserAgentTaskRequest = {
                ...data,
                ...this.userAgent,
            }
            return [dataWithUserAgent, true]
        }
        return [data, false]
    }

    protected isProxyTask = <T extends ITask>(
        data: T
    ): [(T & IProxyTaskRequest) | T, boolean] => {
        if (
            this.proxy.proxyType !== undefined &&
            this.proxy.proxyAddress !== undefined &&
            this.proxy.proxyPort !== undefined
        ) {
            const dataWithProxy: T & IProxyTaskRequest = {
                ...data,
                ...this.proxy,
            }
            return [dataWithProxy, true]
        }
        const d = data
        d.type += "Proxyless"
        return [d, false]
    }
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface IErrorResponse {
    errorId: number
    errorCode?: string
    errorDescription?: string
}

export interface IRequest {
    clientKey: string
    callbackUrl: string
    taskId: number
}

export interface ITaskRequest<T extends ITask>
    extends PartialBy<
        Pick<IRequest, "clientKey" | "callbackUrl">,
        "callbackUrl"
    > {
    task: T
}

export interface ITask {
    type: string
}

export interface IUserAgentTaskRequest {
    userAgent?: string
}

export type ProxyType = "http" | "https" | "socks4" | "socks5"

export interface IProxyTaskRequest {
    proxyType?: ProxyType
    proxyAddress?: string
    proxyPort?: number
    proxyLogin?: string
    proxyPassword?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITaskSolution {}

export interface ITaskResponse<T extends ITaskSolution>
    extends IErrorResponse,
        Pick<IResponse, "status"> {
    solution?: T
}

export interface IResponse extends IErrorResponse {
    balance?: number
    taskId?: number
    status?: "processing" | "ready"
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]
