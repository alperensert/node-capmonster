import { ITask, ITaskSolution, UAProxy } from "../capmonster"

export class TenDITask extends UAProxy {
    /**
     * Initialize a new TenDITask for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link ITenDITaskRequest}
     * @returns Only the task you created {@link ITenDITaskRequest}
     */
    public task = (task: Omit<ITenDITaskRequest, "type" | "class">) => task

    /**
     * Creates a TenDITask for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<ITenDITaskRequest, "type" | "class">
    ): Promise<number> => {
        const data: ITenDITaskRequest = {
            type: "CustomTask",
            class: "TenDI",
            ...task,
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
        this._getTaskResult<ITenDITaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<ITenDITaskResponse>(taskId, timeout)
}

interface ITenDITaskRequest extends ITask {
    type: "CustomTask"
    class: "TenDI"
    /**
     * Address of the main page where the captcha is solved.
     */
    websiteURL: string
    /**
     * captchaAppId. For example "websiteKey": "189123456" - is a unique parameter for your site.
     * You can take it from an html page with a captcha or from traffic (see description below).
     */
    websiteKey: string
}

interface ITenDITaskResponse extends ITaskSolution {
    data: ITenDITaskResponseData
    headers: Record<string, string>
}

interface ITenDITaskResponseData {
    randstr: string
    ticket: string
}
