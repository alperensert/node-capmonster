import { ITask, ITaskSolution, ProxyConfig, UAProxy } from "../capmonster"

export class YidunTask extends UAProxy {
    /**
     * Initialize a new YidunTask for handling Yidun captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IYidunTaskRequest}
     * @returns Only the task you created {@link IYidunTaskRequest}
     */
    public task = (
        task: Omit<IYidunTaskRequest, "type"> & { proxy?: ProxyConfig }
    ) => task

    /**
     * Creates a Yidun captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<IYidunTaskRequest, "type"> & { proxy?: ProxyConfig }
    ): Promise<number> => {
        const { proxy, ...rest } = task
        const data: IYidunTaskRequest = {
            type: "YidunTask",
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
        this._getTaskResult<IYidunTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IYidunTaskResponse>(taskId, timeout)
}

interface IYidunTaskRequest extends ITask {
    type: "YidunTask" | "YidunTaskProxyless"
    /**
     * Address of the page where the captcha is solved
     */
    websiteURL: string
    /**
     * Yidun website key (captchaId)
     */
    websiteKey: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IYidunTaskResponse extends ITaskSolution {}
