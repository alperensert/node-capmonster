import { CapmonsterClient, ITask, ITaskSolution } from "../capmonster"

export class ImageToTextTask extends CapmonsterClient {
    /**
     * Initialize a new ImageToText task for handling the captchas
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
        image: string,
        module?: string,
        recognizingThreshold?: number,
        _case?: boolean,
        numeric?: number,
        math?: boolean
    ): Promise<number> => {
        console.warn(
            "This function is deprecated, use `task` & `createWithTask` to avoid errors in future versions"
        )
        const data: IImageToTextTaskRequest = {
            type: "ImageToTextTask",
            body: image,
            CapMonsterModule: module,
            recognizingThreshold,
            Case: _case,
            numeric,
            math,
        }
        return await this._createTask(data)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IImageToTextTaskRequest}
     * @returns Only the task you created {@link IImageToTextTaskRequest}
     * @since v0.4
     */
    public task = (task: Omit<IImageToTextTaskRequest, "type">) => task

    /**
     * Creates a image to text task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4
     */
    public createWithTask = async (
        task: Omit<IImageToTextTaskRequest, "type">
    ): Promise<number> => {
        return await this._createTask({
            type: "ImageToTextTask",
            ...task,
        })
    }

    /**
     * Get task result
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @returns Returns the solution if captcha is solved, otherwise null
     * @also see {@link joinTaskResult}
     */
    public getTaskResult = async (taskId: number) =>
        this._getTaskResult<IImageToTextTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IImageToTextTaskResponse>(taskId, timeout)

    /**
     * Prepare image from local drive for {@link task} or {@link createWithTask}
     * @param path Local image path. You should resolve
     * the path with `path.resolve` before passing the parameter..
     * @returns The image as converted to base64 string
     * @since v0.4
     */
    public prepareImageFromLocal = async (path: string) =>
        import("fs").then((fs) => fs.readFileSync(path, "base64"))

    /**
     * Prepare image with url for {@link task} or {@link createWithTask}
     * @param url External image link. Example: https://somedomain.com/captcha.png
     * @returns The image as converted to base64 string
     * @since v0.4
     */
    public prepareImageFromLink = (url: string) =>
        fetch(url)
            .then((res) => res.arrayBuffer())
            .then((buffer) => Buffer.from(buffer).toString("base64"))
}

interface IImageToTextTaskRequest extends ITask {
    type: "ImageToTextTask"
    /**
     * File body encoded in base64. Make sure
     * to send it without line breaks.
     */
    body: string
    /**
     * Name of recognizing module.
     * @example yandex
     * @see https://bit.ly/3Z46YpN for list of recognizing modules
     */
    CapMonsterModule?: string
    /**
     * Captcha recognition threshold with a possible value
     * from 0 to 100. For example, if recognizingThreshold was set to 90
     * and the task was solved with a confidence of 80, you won't be charged.
     * In this case the user will get a response `ERROR_CAPTCHA_UNSOLVABLE`.
     */
    recognizingThreshold?: number
    /**
     * Set this `true` if captcha is case sensitive
     * @default false
     */
    Case?: boolean
    /**
     * Set this `1` if captcha contains numbers only
     * @default 0
     */
    numeric?: number
    /**
     * Set this `true` if captcha requires a mathematical operation.
     * Example: if captcha is `2 + 7 =` return value will be `9`
     */
    math?: boolean
}

interface IImageToTextTaskResponse extends ITaskSolution {
    /**
     * Captcha answer
     */
    text: string
}
