import { ITask, ITaskSolution, UAProxy } from "../capmonster"

export class AmazonTask extends UAProxy {
    /**
     * Initialize a new AmazonTask for handling the captchas
     * @param clientKey Unique key of your account
     * @since v0.4.4
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates a aws waf captcha task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4.4
     */
    public createWithTask = async (
        task: Omit<IAmazonTaskRequest, "type">
    ): Promise<number> => {
        const data: IAmazonTaskRequest = {
            type: "AmazonTaskProxyless",
            ...task,
        }
        const [userAgentData] = this.isUserAgentTask(data)
        return await this._createTask(userAgentData)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IAmazonTaskRequest}
     * @returns Only the task you created {@link IAmazonTaskRequest}
     * @since v0.4.4
     */
    public task = (task: Omit<IAmazonTaskRequest, "type">) => task

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<IAmazonTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IAmazonTaskResponse>(taskId, timeout)
}

interface IAmazonTaskRequest extends ITask {
    type: "AmazonTaskProxyless"
    /**
     * The address of the main page where captcha is solved
     */
    websiteURL: string
    /**
     * A string that can be retrieved from an html page with a captcha
     * or with javascript by executing the `window.gokuProps.key`
     */
    websiteKey: string
    /**
     * Link to challenge.js
     */
    challengeScript: string
    /**
     * Link to captcha.js
     */
    captchaScript: string
    /**
     * A string that can be retrieved from an html page with a captcha
     * or with javascript by executing the `window.gokuProps.context`
     */
    context: string
    /**
     * A string that can be retrieved from an html page with a captcha
     * or with javascript by executing the `window.gokuProps.iv`
     */
    iv: string
    /**
     * By default false. If you need to use cookies "aws-waf-token", specify the value true.
     * Otherwise, what you will get in return is "captcha_voucher" and "existing_token".
     */
    cookieSolution?: boolean
}

interface IAmazonTaskResponse extends ITaskSolution {
    cookies: Record<string, string>
    userAgent: string
}
