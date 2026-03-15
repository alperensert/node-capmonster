import { ITask, ITaskSolution, UAProxy } from "../capmonster"

export class ImpervaTask extends UAProxy {
    /**
     * Initialize a new ImpervaTask for handling Imperva/Incapsula captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IImpervaTaskRequest}
     * @returns Only the task you created {@link IImpervaTaskRequest}
     */
    public task = (
        task: Omit<IImpervaTaskRequest, "type" | "class">
    ) => task

    /**
     * Creates an Imperva/Incapsula captcha task for solving.
     * Proxy is required for this task type.
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<IImpervaTaskRequest, "type" | "class">
    ): Promise<number> => {
        const data: IImpervaTaskRequest = {
            type: "CustomTask",
            class: "Imperva",
            ...task,
            ...this.proxy,
        }
        const [userAgentData] = this.isUserAgentTask(data)
        return await this._createTask(userAgentData)
    }

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<IImpervaTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IImpervaTaskResponse>(taskId, timeout)
}

interface IImpervaTaskRequestMetaData {
    /**
     * URL of the Incapsula script on the target site
     */
    incapsulaScriptUrl: string
    /**
     * Incapsula cookies from the target site
     */
    incapsulaCookies: string
    /**
     * Reese84 URL endpoint
     */
    reese84UrlEndpoint: string
}

interface IImpervaTaskRequest extends ITask {
    type: "CustomTask"
    class: "Imperva"
    /**
     * Address of the main page where the captcha is solved.
     */
    websiteURL: string
    /**
     * @see {@link IImpervaTaskRequestMetaData}
     */
    metadata: IImpervaTaskRequestMetaData
}

interface IImpervaTaskResponse extends ITaskSolution {
    domains: Record<string, object>
}
