import { CapmonsterClient, ITask, ITaskSolution } from "../capmonster"

export class RecaptchaV3Task extends CapmonsterClient {
    /**
     * Initialize a new RecaptchaV3Task for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Create task
     * @param websiteUrl Address of a webpage with Google ReCaptcha
     * @param websiteKey Recaptcha website key.
     * @param minimumScore Value between 0.1 to 0.9
     * @param pageAction Widget action value. Website owner defines
     * what user is doing on the page through
     * this parameter. Default value: verify
     * @param noCache
     * @returns ID of the created task
     * @deprecated since v0.4 - use {@link task} & {@link createWithTask} instead
     */
    public createTask = async (
        websiteUrl: string,
        websiteKey: string,
        minimumScore?: number,
        pageAction?: string,
        noCache?: boolean
    ): Promise<number> => {
        console.warn(
            "This function is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: IRecaptchaV3TaskRequest = {
            type: "RecaptchaV3TaskProxyless",
            websiteURL: websiteUrl,
            websiteKey,
            minScore: this.checkScore(minimumScore),
            pageAction,
            noCache,
        }
        return await this._createTask(data)
    }

    /**
     * Creates `only` the task configuration for reuseable tasks.
     * @param task {@link IRecaptchaV3TaskRequest}
     * @returns Only the task you created {@link IRecaptchaV3TaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<IRecaptchaV3TaskRequest, "type">) => task

    /**
     * Creates a recaptcha v3 task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<IRecaptchaV3TaskRequest, "type">
    ) => {
        const data: IRecaptchaV3TaskRequest = {
            type: "RecaptchaV3TaskProxyless",
            ...task,
        }
        return await this._createTask(data)
    }

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<IRecaptchaV3TaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IRecaptchaV3TaskResponse>(taskId, timeout)

    private checkScore = (score?: number): number | undefined => {
        if (score === undefined) return score
        if (score >= 0.9 || score <= 0.1) return 0.3
        return score
    }
}

interface IRecaptchaV3TaskRequest extends ITask {
    type: "RecaptchaV3TaskProxyless"
    /**
     * Address of a webpage with Google ReCaptcha
     */
    websiteURL: string
    /**
     * Recaptcha website key.
     */
    websiteKey: string
    /**
     * Value between 0.1 to 0.9.
     */
    minScore?: number
    /**
     * Widget action value. Website owner defines
     * what user is doing on the page through
     * this parameter.
     * @default verify
     */
    pageAction?: string
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

interface IRecaptchaV3TaskResponse extends ITaskSolution {
    /**
     * Hash which should be inserted into RecaptchaV3
     * submit form in `textarea#g-recaptcha-response`.
     * It has a length of 500 to 2190 bytes.
     */
    gRecaptchaResponse: string
}
