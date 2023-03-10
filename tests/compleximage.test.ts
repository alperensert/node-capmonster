// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
import { CapmonsterError, ComplexImageTask } from "../src"
import { tasks } from "./utils/config.json"

describe("ComplexImageTask", () => {
    let captcha: ComplexImageTask
    let taskId: number
    beforeEach(() => {
        captcha = new ComplexImageTask(process.env.API_KEY)
    })
    test("check task & createWithTask", async () => {
        const task = captcha.task({
            class: "hcaptcha",
            imageUrls: tasks.compleximageHCaptcha.imageUrls,
            metadata: {
                Task: tasks.compleximageHCaptcha.task,
            },
        })
        expect(task.imagesBase64).toBeUndefined()
        expect(task.metadata.Grid).toBeUndefined()
        try {
            const _taskId = captcha.createWithTask(task)
            expect(taskId).resolves.not.toBeUndefined()
            taskId = await _taskId
        } catch (err) {
            expect(err).not.toBeInstanceOf(CapmonsterError)
        }
    })
    test("check getTaskResult", () => {
        const result = captcha.getTaskResult(taskId)
        expect(result).resolves.not.toThrowError()
    })
    test("check joinTaskResult", async () => {
        try {
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("answer")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })
})
