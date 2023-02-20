import { UAProxy, ITask, ITaskSolution } from "../capmonster"

export class RecaptchaV2EnterpriseTask extends UAProxy {
    /**
     * Initialize a new RecaptchaV2
     * Enterprise Task for handling the captchas
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
        cookies?: string | Array<unknown> | object,
        enterprisePayload?: string,
        apiDomain?: string,
        noCache?: boolean
    ): Promise<number> => {
        console.warn(
            "This function is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: IRecaptchaV2ETaskRequest = {
            type: "RecaptchaV2EnterpriseTask",
            websiteURL: websiteUrl,
            websiteKey,
            cookies: cookies ? this.addCookies(cookies) : undefined,
            enterprisePayload,
            apiDomain,
            noCache,
        }
        const [proxyData] = this.isProxyTask(data)
        const [userAgentData] = this.isUserAgentTask(proxyData)
        return await this._createTask(userAgentData)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IRecaptchaV2ETaskRequest}
     * @returns Only the task you created {@link IRecaptchaV2ETaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<IRecaptchaV2ETaskRequest, "type">) => task

    /**
     * Creates a recaptchav2 enterprise task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4
     */
    public createWithTask = async (
        task: Omit<IRecaptchaV2ETaskRequest, "type">
    ): Promise<number> => {
        const data: IRecaptchaV2ETaskRequest = {
            type: "RecaptchaV2EnterpriseTask",
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
        this._getTaskResult<IRecaptchaV2ETaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IRecaptchaV2ETaskResponse>(taskId, timeout)
}

interface IRecaptchaV2ETaskRequest extends ITask {
    type: "RecaptchaV2EnterpriseTaskProxyless" | "RecaptchaV2EnterpriseTask"
    /**
     * Address of a webpage with Google ReCaptcha Enterprise
     */
    websiteURL: string
    /**
     * Recaptcha website key.
     */
    websiteKey: string
    /**
     * Some implementations of the reCAPTCHA Enterprise
     * widget may contain additional parameters that are passed to
     * the “grecaptcha.enterprise.render” method along with the sitekey.
     */
    enterprisePayload?: string
    /**
     * Domain address from which to load reCAPTCHA Enterprise.
     * For example:
     * - www.google.com
     * - www.recaptcha.net
     *
     * Don't use a parameter if you don't know why it's needed.
     */
    apiDomain?: string
    /**
     * Additional cookies which we must use
     * during interaction with target page or Google.
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

interface IRecaptchaV2ETaskResponse extends ITaskSolution {
    /**
     * Hash which should be inserted into RecaptchaV2
     * submit form in `textarea#g-recaptcha-response`.
     * It has a length of 500 to 2190 bytes.
     */
    gRecaptchaResponse: string
}
