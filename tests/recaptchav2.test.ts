// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
import { CapmonsterError, RecaptchaV2Task } from "../src"
import { tasks, utils } from "./utils/config.json"

describe("RecaptchaV2Task", () => {
    const warn = jest.spyOn(global.console, "warn")
    let captcha: RecaptchaV2Task
    let taskId: number
    const values = tasks.reCaptchaV2
    beforeEach(() => {
        captcha = new RecaptchaV2Task(process.env.API_KEY)
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
            cookies: captcha.convertCookies(utils.fakeCookies),
        })
        expect(task.cookies).toEqual(utils.expectedFakeCookies)
        expect(task.noCache).toBeUndefined()
        expect(task.recaptchaDataSValue).toBeUndefined()
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
            expect(result).toHaveProperty("gRecaptchaResponse")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })
})
