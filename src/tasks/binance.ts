import { ITask, ITaskSolution, UAProxy } from "../capmonster"

export class BinanceTask extends UAProxy {
    /**
     * Initialize a new BinanceTask for handling Binance captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IBinanceTaskRequest}
     * @returns Only the task you created {@link IBinanceTaskRequest}
     */
    public task = (task: Omit<IBinanceTaskRequest, "type">) => task

    /**
     * Creates a Binance captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<IBinanceTaskRequest, "type">
    ): Promise<number> => {
        const data: IBinanceTaskRequest = {
            type: "BinanceTask",
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
        this._getTaskResult<IBinanceTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IBinanceTaskResponse>(taskId, timeout)
}

interface IBinanceTaskRequest extends ITask {
    type: "BinanceTaskProxyless" | "BinanceTask"
    /**
     * Address of a webpage with Binance captcha
     */
    websiteURL: string
    /**
     * The bizId value from the Binance captcha configuration
     */
    websiteKey: string
    /**
     * Validate ID for the Binance captcha
     */
    validateId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBinanceTaskResponse extends ITaskSolution {}
