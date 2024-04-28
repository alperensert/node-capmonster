import { ITask, ITaskSolution, UAProxy } from "../capmonster"

export class GeeTestV4Task extends UAProxy {
    /**
     * Initialize a new GeeTestV4Task for handling the captchas
     * @param clientKey Unique key of your account
     * @since v0.4.5
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IGeeTestTaskRequest}
     * @returns Only the task you created {@link IGeeTestTaskRequest}
     * @since v0.4.5
     */
    public task = (task: Omit<IGeeTestV4TaskRequest, "type" | "version">) =>
        task

    /**
     * Creates a gee test task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4.5
     */
    public createWithTask = async (
        task: Omit<IGeeTestV4TaskRequest, "type" | "version">
    ): Promise<number> => {
        const data: IGeeTestV4TaskRequest = {
            type: "GeeTestTask",
            version: 4,
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
        this._getTaskResult<IGeeTestV4TaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IGeeTestV4TaskResponse>(taskId, timeout)
}

interface IGeeTestV4TaskRequest extends ITask {
    type: "GeeTestTask" | "GeeTestTaskProxyless"
    version: 4
    /**
     * Address of the page on which the captcha is recognized
     */
    websiteURL: string
    /**
     * The GeeTest identifier key for the domain.
     * Static value, rarely updated.
     * For GeeTestV4, this is the clientId parameter.
     */
    gt: string
    /**
     * Additional parameters for version 4.
     */
    initParameters: Record<string, string>
}

/**
 * All five parameters are required when submitting the form on the target site.
 */
interface IGeeTestV4TaskResponse extends ITaskSolution {
    captcha_id: string
    lot_number: string
    pass_token: string
    gen_time: string
    captcha_output: string
}
