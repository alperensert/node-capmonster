import { ITask, ITaskSolution, ProxyConfig, UAProxy } from "../capmonster"

export class TSPDTask extends UAProxy {
    /**
     * Initialize a new TSPDTask for handling TSPD captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link ITSPDTaskRequest}
     * @returns Only the task you created {@link ITSPDTaskRequest}
     */
    public task = (
        task: Omit<ITSPDTaskRequest, "type"> & { proxy?: ProxyConfig }
    ) => task

    /**
     * Creates a TSPD task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<ITSPDTaskRequest, "type"> & { proxy?: ProxyConfig }
    ): Promise<number> => {
        const { proxy, ...rest } = task
        const data: ITSPDTaskRequest = {
            type: "TSPDTask",
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
        this._getTaskResult<ITSPDTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<ITSPDTaskResponse>(taskId, timeout)
}

interface ITSPDTaskRequest extends ITask {
    type: "TSPDTask" | "TSPDTaskProxyless"
    /**
     * Address of the page where the captcha is solved
     */
    websiteURL: string
    /**
     * TSPD website key
     */
    websiteKey: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITSPDTaskResponse extends ITaskSolution {}
