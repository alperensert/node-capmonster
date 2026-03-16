import { ITask, ITaskSolution, ProxyConfig, UAProxy } from "../capmonster"

export class RecaptchaV2Task extends UAProxy {
    /**
     * Initialize a new RecaptchaV2Task for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IRecaptchaV2TaskRequest}
     * @returns Only the task you created {@link IRecaptchaV2TaskRequest}
     * @since v0.4
     */
    public task = (
        task: Omit<IRecaptchaV2TaskRequest, "type"> & {
            proxy?: ProxyConfig
        }
    ) => task

    /**
     * Creates a recaptchav2 task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4
     */
    public createWithTask = async (
        task: Omit<IRecaptchaV2TaskRequest, "type"> & {
            proxy?: ProxyConfig
        }
    ): Promise<number> => {
        const { proxy, ...rest } = task
        const data: IRecaptchaV2TaskRequest = {
            type: "RecaptchaV2Task",
            ...rest,
        }
        const [proxyData] = this.isProxyTask(data, proxy)
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
        this._getTaskResult<IRecaptchaV2TaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IRecaptchaV2TaskResponse>(taskId, timeout)
}

interface IRecaptchaV2TaskRequest extends ITask {
    type: "RecaptchaV2TaskProxyless" | "RecaptchaV2Task"
    /**
     * Address of a webpage with Google ReCaptcha
     */
    websiteURL: string
    /**
     * Recaptcha website key.
     */
    websiteKey: string
    /**
     * Some custom implementations contains additional "data-s"
     * parameter in ReCaptcha2 div, which is in fact a one-time token and
     * must be grabbed every time you want to solve a ReCaptcha2.
     */
    recaptchaDataSValue?: string
    /**
     * Set to true for invisible reCAPTCHA (hidden field, no checkbox).
     */
    isInvisible?: boolean
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

interface IRecaptchaV2TaskResponse extends ITaskSolution {
    /**
     * Hash which should be inserted into Recaptcha2
     * submit form in `textarea#g-recaptcha-response`.
     * It has a length of 500 to 2190 bytes.
     */
    gRecaptchaResponse: string
}
