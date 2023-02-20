import { UAProxy, ITask, ITaskSolution } from "../capmonster"

export class FuncaptchaTask extends UAProxy {
    /**
     * Initialize a new FuncaptchaTask for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Create task
     * @returns ID of the created task
     * @deprecated since v0.4 - use {@link task} & {@link createWithTask} instead
     */
    public createTask = async (
        websiteUrl: string,
        websitePublicKey: string,
        apiJsSubdomain?: string,
        dataBlob?: string,
        cookies?: string | Array<unknown> | object,
        noCache?: boolean
    ): Promise<number> => {
        console.warn(
            "`createTask` is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: IFuncaptchaTaskRequest = {
            type: "FunCaptchaTask",
            websiteURL: websiteUrl,
            websitePublicKey,
            funcaptchaApiJSSubdomain: apiJsSubdomain,
            cookies: cookies ? this.addCookies(cookies) : undefined,
            data: dataBlob,
            noCache,
        }
        const [proxyData] = this.isProxyTask(data)
        const [userAgentData] = this.isUserAgentTask(proxyData)
        return await this._createTask(userAgentData)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IFuncaptchaTaskRequest}
     * @returns Only the task you created {@link IFuncaptchaTaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<IFuncaptchaTaskRequest, "type">) => task

    /**
     * Creates a fun captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4
     */
    public createWithTask = async (
        task: Omit<IFuncaptchaTaskRequest, "type">
    ): Promise<number> => {
        const data: IFuncaptchaTaskRequest = {
            type: "FunCaptchaTask",
            ...task,
        }
        const [proxyData] = this.isProxyTask(data)
        const [userAgentData] = this.isUserAgentTask(proxyData)
        return await this._createTask(userAgentData)
    }

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<IFuncaptchaTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IFuncaptchaTaskResponse>(taskId, timeout)
}

interface IFuncaptchaTaskRequest extends ITask {
    type: "FunCaptchaTaskProxyless" | "FunCaptchaTask"
    /**
     * Address of a webpage with FunCaptcha
     */
    websiteURL: string
    /**
     * A special subdomain of funcaptcha.com, from which
     * the JS captcha widget should be loaded. Most FunCaptcha installations
     * work from shared domains, so this option is only
     * needed in certain rare cases.
     */
    funcaptchaApiJSSubdomain?: string
    /**
     * FunCaptcha website key.
     */
    websitePublicKey?: string
    /**
     * Additional parameter that may be required
     * by FunCaptcha implementation.
     * Use this property to send "blob" value as a stringified array.
     */
    data?: string
    /**
     * Additional cookies which we must
     * use during interaction with target page or Google.
     */
    cookies?: string
    /**
     * @default false
     * @description You receive a token from CapMonster Cloud,
     * send it to the site, but the site rejects it. Moreover,
     * sometimes the site can accept a token, for example, in
     * one case out of 10 (the percentage of success in
     * your case may be different). In this case, the `nocache` parameter can help you.
     * @see https://bit.ly/3ShgMuo for more information
     */
    noCache?: boolean
}

interface IFuncaptchaTaskResponse extends ITaskSolution {
    /**
     * FunCaptcha token that needs to be substituted into the form.
     */
    token: string
}
