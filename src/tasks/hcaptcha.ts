import { UAProxy, ITask, ITaskSolution } from "../capmonster"

export class HCaptchaTask extends UAProxy {
    /**
     * Initialize a new HCaptchaTask for handling the captchas
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
        websiteKey: string,
        isInvisible?: boolean,
        customData?: string,
        cookies?: string | Array<unknown> | object,
        noCache?: boolean
    ): Promise<number> => {
        console.warn(
            "This function is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: IHCaptchaTaskRequest = {
            type: "HCaptchaTask",
            websiteURL: websiteUrl,
            websiteKey,
            isInvisible,
            data: customData,
            cookies: cookies ? this.addCookies(cookies) : undefined,
            noCache,
        }
        const [proxyData] = this.isProxyTask(data)
        return await this._createTask(proxyData)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IHCaptchaTaskRequest}
     * @returns Only the task you created {@link IHCaptchaTaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<IHCaptchaTaskRequest, "type">) => task

    /**
     * Creates a hcaptcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4
     */
    public createWithTask = async (
        task: Omit<IHCaptchaTaskRequest, "type">
    ): Promise<number> => {
        const data: IHCaptchaTaskRequest = {
            type: "HCaptchaTask",
            ...task,
        }
        const [proxyData] = this.isProxyTask(data)
        return await this._createTask(proxyData)
    }

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<IHCaptchaTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IHCaptchaTaskResponse>(taskId, timeout)
}

interface IHCaptchaTaskRequest extends ITask {
    type: "HCaptchaTask" | "HCaptchaTaskProxyless"
    /**
     * Address of a webpage with hCaptcha
     */
    websiteURL: string
    /**
     * hCaptcha website key.
     */
    websiteKey: string
    /**
     * Set `true` for invisible version of hcaptcha
     * @default false
     */
    isInvisible?: boolean
    /**
     * Custom data that is used in some
     * implementations of hCaptcha, mostly used with
     * `isInvisible=true`
     */
    data?: string
    /**
     * Additional cookies which we must use
     * during interaction with target page.
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

interface IHCaptchaTaskResponse extends ITaskSolution {
    /**
     * Hash which should be inserted into
     * hCaptcha submit form on target website.
     */
    gRecaptchaResponse: string
    /**
     * The result of the "window.hcaptcha.getRespKey()"
     * function when available. Some sites use this value
     * for additional verification.
     */
    respKey: string
    /**
     * During submitting, you should use the
     * same User Agent with which hCaptcha was solved.
     */
    userAgent: string
}
