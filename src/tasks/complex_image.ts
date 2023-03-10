import { ITask, ITaskSolution, RequireAtLeastOne, UAProxy } from "../capmonster"

export class ComplexImageTask extends UAProxy {
    /**
     * Initialize a new ComplexImageTask task for handling the captchas
     * @param clientKey Unique key of your account
     * @since v0.4.2
     */
    constructor(clientKey: string) {
        super(clientKey)
    }

    /**
     * Creates only the task configuration for reuseable tasks.
     * @param task {@link IComplexImageTaskRequest}
     * @returns Only the task you created {@link IComplexImageTaskRequest}
     * @since v0.4.2
     */
    public task = (
        task: RequireAtLeastOne<
            Omit<IComplexImageTaskRequest, "type">,
            "imageUrls" | "imagesBase64"
        >
    ) => task

    /**
     * Creates a complex image task for solving
     * @param task {@link task}
     * @returns ID of the created task
     * @since v0.4.2
     */
    public createWithTask = async (
        task: RequireAtLeastOne<
            Omit<IComplexImageTaskRequest, "type">,
            "imageUrls" | "imagesBase64"
        >
    ): Promise<number> => {
        const data: IComplexImageTaskRequest = {
            type: "ComplexImageTask",
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
        this._getTaskResult<IComplexImageTaskResponse>(taskId)

    /**
     * Get task result. This function is waits until task to be solved.
     * @param taskId Task id which returns from {@link createWithTask} function.
     * @param timeout (as seconds) Sets the timeout for the current execution of this function.
     * @returns Solution of the task
     * @throws CapmonsterError, if task can't be solved in maximum time
     * @also see {@link getTaskResult}
     */
    public joinTaskResult = async (taskId: number, timeout?: number) =>
        this._joinTaskResult<IComplexImageTaskRequest>(taskId, timeout)

    /**
     * Prepare image from local drive for {@link task} or {@link createWithTask}
     * @param path Local image path. You should resolve
     * the path with `path.resolve` before passing the parameter..
     * @returns The image as converted to base64 string
     * @since v0.4
     */
    public prepareImageFromLocal = async (path: string) =>
        import("fs").then((fs) => fs.readFileSync(path, "base64"))
}

interface IComplexImageTaskRequest extends ITask {
    type: "ComplexImageTask"
    /**
     * Specifies the task object class.
     * Currently on supports "recaptcha"
     */
    class: "recaptcha" | "hcaptcha"
    /**
     * List with image URLs.
     */
    imageUrls?: string[]
    /**
     * List with images in base64 format
     */
    imagesBase64?: string[]
    /**
     * @also see {@link MetaData}
     */
    metadata: RequireAtLeastOne<MetaData, "Task" | "TaskDefinition">
}

interface IComplexImageTaskResponse extends ITaskSolution {
    /**
     * List with boolean values, "true"
     * means that you need to click on the
     * image corresponding to this position
     */
    answer: boolean[]
}

interface MetaData {
    /**
     * Image grid size
     */
    Grid?: string | "4x4" | "3x3" | "1x1"
    /**
     * ## Only for ReCaptcha images!
     * Technical value that defines the task type.
     * ### How to get TaskDefinition?
     * The data can be found in responses to "/recaptcha/{recaptchaApi}/reload"
     * or "/recaptcha/{recaptchaApi}/userverify" requests, where recaptchaApi
     * is "enterprise" or "api2" depending on the Recaptcha type. The response
     * contains json, in which one can take a list of TaskDefinitions for loaded captchas.
     */
    TaskDefinition?: string
    /**
     * Task text (in English).
     * @see TaskDefinition
     */
    Task?: string
}
