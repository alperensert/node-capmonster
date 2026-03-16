import { ITask, ITaskSolution, UAProxy } from "../capmonster"

export class TemuTask extends UAProxy {
    /**
     * Initialize a new TemuTask for handling Temu captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link ITemuTaskRequest}
     * @returns Only the task you created {@link ITemuTaskRequest}
     */
    public task = (task: Omit<ITemuTaskRequest, "type" | "class">) => task

    /**
     * Creates a Temu captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<ITemuTaskRequest, "type" | "class">
    ): Promise<number> => {
        const data: ITemuTaskRequest = {
            type: "CustomTask",
            class: "Temu",
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
        this._getTaskResult<ITemuTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<ITemuTaskResponse>(taskId, timeout)
}

interface ITemuTaskRequest extends ITask {
    type: "CustomTask"
    class: "Temu"
    /**
     * Address of the main page where the captcha is solved
     */
    websiteURL: string
    /**
     * Temu website key
     */
    websiteKey: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITemuTaskResponse extends ITaskSolution {}
