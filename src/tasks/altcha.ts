import { ITask, ITaskSolution, ProxyConfig, UAProxy } from "../capmonster"

export class AltchaTask extends UAProxy {
    /**
     * Initialize a new AltchaTask for handling Altcha captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IAltchaTaskRequest}
     * @returns Only the task you created {@link IAltchaTaskRequest}
     */
    public task = (
        task: Omit<IAltchaTaskRequest, "type"> & { proxy?: ProxyConfig }
    ) => task

    /**
     * Creates an Altcha captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<IAltchaTaskRequest, "type"> & { proxy?: ProxyConfig }
    ): Promise<number> => {
        const { proxy, ...rest } = task
        const data: IAltchaTaskRequest = {
            type: "AltchaTask",
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
        this._getTaskResult<IAltchaTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IAltchaTaskResponse>(taskId, timeout)
}

interface IAltchaTaskRequest extends ITask {
    type: "AltchaTask" | "AltchaTaskProxyless"
    /**
     * Address of the page where the captcha is solved
     */
    websiteURL: string
    /**
     * Altcha website key
     */
    websiteKey: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAltchaTaskResponse extends ITaskSolution {}
