// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
import { CapmonsterError, TurnstileTask } from "../src"
import { tasks } from "./utils/config.json"

describe("TurnstileTask", () => {
    const warn = jest.spyOn(global.console, "warn")
    let captcha: TurnstileTask
    let taskId: number
    const values = tasks.turnstile
    beforeEach(() => {
        captcha = new TurnstileTask(process.env.API_KEY)
    })
    test("check createTask", async () => {
        warn.mockReset()
        const _taskId = captcha.createTask(values.websiteUrl, values.websiteKey)
        expect(warn).toBeCalledTimes(1)
        expect(_taskId).resolves.not.toBeUndefined()
        taskId = await _taskId
    })
    test("check task & createWithTask", async () => {
        const task = captcha.task({
            websiteKey: values.websiteKey,
            websiteURL: values.websiteUrl,
        })
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
            expect(result).toHaveProperty("token")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })
})
