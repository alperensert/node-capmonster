import { UAProxy, ITask, ITaskSolution } from "../capmonster"

export class TurnstileTask extends UAProxy {
    /**
     * Initialize a new Turnstile task for handling the captchas
     * @param clientKey Unique key of your account
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Create task
     * @returns ID of the created task
     * @deprecated since v0.4 - use {@link task} & {@link createWithTask} instead
     */
    public createTask = async (
        websiteURL: string,
        websiteKey: string
    ): Promise<number> => {
        console.warn(
            "This function is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: ITurnstileTaskRequest = {
            type: "TurnstileTask",
            websiteKey,
            websiteURL,
        }
        const [proxyData] = this.isProxyTask(data)
        return await this._createTask(proxyData)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link ITurnstileTaskRequest}
     * @returns Only the task you created {@link ITurnstileTaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<ITurnstileTaskRequest, "type">) => task

    /**
     * Creates a turnstile task for solving
     * @param task {@link task}
     * @returns ID of the created task
     */
    public createWithTask = async (
        task: Omit<ITurnstileTaskRequest, "type">
    ): Promise<number> => {
        const data: ITurnstileTaskRequest = {
            type: "TurnstileTask",
            ...task,
        }
        const [proxyData] = this.isProxyTask(data)
        return await this._createTask(proxyData)
    }

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<ITurnstileTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<ITurnstileTaskResponse>(taskId, timeout)
}

interface ITurnstileTaskRequest extends ITask {
    type: "TurnstileTaskProxyless" | "TurnstileTask"
    /**
     * Address of a webpage with Turnstile Task
     */
    websiteURL: string
    /**
     * Turnstile key
     */
    websiteKey: string
    /**
     * Action field from the Turnstile callback function.
     */
    pageAction?: string
    /**
     * Value from the cData parameter of the Turnstile widget.
     */
    data?: string
    /**
     * Set to "token" or "cf_clearance" for Cloudflare Challenge pages.
     * - "token": returns a token
     * - "cf_clearance": returns a cf_clearance cookie (proxy required)
     */
    cloudflareTaskType?: "token" | "cf_clearance"
    /**
     * Value from chlPageData parameter (required for Cloudflare Challenge token mode).
     */
    pageData?: string
    /**
     * Base64-encoded HTML of the Cloudflare "Just a moment" page
     * (required for cf_clearance mode).
     */
    htmlPageBase64?: string
    /**
     * Browser User-Agent (required for Cloudflare Challenge).
     */
    userAgent?: string
    /**
     * Captcha script URL (optional for Cloudflare Challenge).
     */
    apiJsUrl?: string
}

interface ITurnstileTaskResponse extends ITaskSolution {
    /**
     * The Turnstile token to be substituted into the form.
     */
    token: string
    /**
     * User-Agent used during solving.
     */
    userAgent?: string
    /**
     * cf_clearance cookie value (only for cloudflareTaskType: "cf_clearance").
     */
    cf_clearance?: string
}
