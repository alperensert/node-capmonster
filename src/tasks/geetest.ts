import { UAProxy, ITask, ITaskSolution } from "../capmonster"

export class GeeTestTask extends UAProxy {
    /**
     * Initialize a new GeeTestTask for handling the captchas
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
        gt: string,
        challenge: string,
        apiServerSubdomain?: string,
        getLib?: string
    ): Promise<number> => {
        console.warn(
            "This function is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: IGeeTestTaskRequest = {
            type: "GeeTestTask",
            websiteURL: websiteUrl,
            gt,
            challenge,
            geetestApiServerSubdomain: apiServerSubdomain,
            geetestGetLib: getLib,
        }
        const [proxyData] = this.isProxyTask(data)
        const [userAgentData] = this.isUserAgentTask(proxyData)
        return await this._createTask(userAgentData)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IGeeTestTaskRequest}
     * @returns Only the task you created {@link IGeeTestTaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<IGeeTestTaskRequest, "type">) => task

    /**
     * Creates a gee test task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4
     */
    public createWithTask = async (
        task: Omit<IGeeTestTaskRequest, "type">
    ): Promise<number> => {
        const data: IGeeTestTaskRequest = {
            type: "GeeTestTask",
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
        this._getTaskResult<IGeeTestTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IGeeTestTaskResponse>(taskId, timeout)
}

interface IGeeTestTaskRequest extends ITask {
    type: "GeeTestTask" | "GeeTestTaskProxyless"
    /**
     * Address of the page on which the captcha is recognized
     */
    websiteURL: string
    /**
     * The GeeTest identifier key for the domain.
     * Static value, rarely updated.
     */
    gt: string
    /**
     * A dynamic key. Each time our API is called, we need to get
     * a new key value. If the captcha is loaded on the page,
     * then the {@link challenge} value is no longer valid and you will get
     * `ERROR_TOKEN_EXPIRED` error.
     *
     * WARNING:
     * You will be charged for tasks with `ERROR_TOKEN_EXPIRED` error!
     *
     * It is necessary to examine the requests and find the one in which
     * this value is returned and, before each creation of the recognition
     * task, execute this request and parse the challenge from it.
     */
    challenge: string
    /**
     * May be required for some sites.
     */
    geetestApiServerSubdomain?: string
    /**
     * May be required for some sites. Send JSON as a string.
     */
    geetestGetLib?: string
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

/**
 * All three parameters are required when
 * submitting the form on the target site.
 */
interface IGeeTestTaskResponse extends ITaskSolution {
    /**
     * @see {@link IGeeTestTaskRequest.challenge}
     */
    challenge: string
    validate: string
    seccode: string
}
