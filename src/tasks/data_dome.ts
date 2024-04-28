import { ITask, ITaskSolution, UAProxy } from "../capmonster"

/**
 * DataDomeTask class for handling data dome captchas
 * @since v0.4.5
 */
export class DataDomeTask extends UAProxy {
    /**
     * Initialize a new DataDomeTask for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IDataDomeTaskRequest}
     * @returns Only the task you created {@link IDataDomeTaskRequest}
     */
    public task = (task: Omit<IDataDomeTaskRequest, "type" | "class">) => task

    /**
     * Creates a data dome captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4.4
     */
    public createWithTask = async (
        task: Omit<IDataDomeTaskRequest, "type" | "class">
    ): Promise<number> => {
        const data: IDataDomeTaskRequest = {
            type: "CustomTask",
            class: "DataDome",
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
        this._getTaskResult<IDataDomeTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IDataDomeTaskResponse>(taskId, timeout)
}

interface IDataDomeTaskRequestMetaData {
    /**
     * Object that contains additional data about the captcha: "htmlPageBase64": "..." -
     * a base64 encoded html page that comes with a 403 code and a Set-Cookie: datadome="..."
     * header in response to a get request to the target site.
     */
    htmlPageBase64: string
    /**
     * Link to the captcha.
     * @example "https://geo.captcha-delivery.com/captcha/?initialCid=..."
     */
    captchaUrl: string
    /**
     * Your cookies from datadome.
     *
     * You can get the cookies on the captcha page using "document.cookie" or
     * in the Set-Cookie request header: "datadome=..."
     */
    datadomeCookie: string
}

interface IDataDomeTaskRequest extends ITask {
    type: "CustomTask"
    class: "DataDome"
    /**
     * Address of the main page where the captcha is solved.
     */
    websiteURL: string
    /**
     * @see {@link IDataDomeTaskRequestMetaData}
     */
    metadata: IDataDomeTaskRequestMetaData
}

interface IDataDomeTaskResponse extends ITaskSolution {
    /**
     * @example "site.com": {
     *              "cookies": {
     *                  "datadome": "t355hfeuUFbsWpoMzXyIWL_ewfwgre25345323rwgregeFEkG5iju9esKVfWMzuLAjcfCIJUIHU7332At1l~HY78g782hidwfeO4K2ZP_CFHYUFEgygfiYGfGYEUfgyefWrXG6_3sy; Max-Age=31536000; Domain=.site.com; Path=/; Secure; SameSite=Lax"
     *              }
     *          }
     */
    domains: Record<string, object>
}
