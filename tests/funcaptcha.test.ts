// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
import { CapmonsterError, FuncaptchaTask } from "../src"
import { tasks, utils } from "./utils/config.json"

describe("FuncaptchaTask", () => {
    const warn = jest.spyOn(global.console, "warn")
    let captcha: FuncaptchaTask
    let taskId: number
    const values = tasks.funcaptcha
    beforeEach(() => {
        captcha = new FuncaptchaTask(process.env.API_KEY)
    })
    test("check createTask", async () => {
        warn.mockReset()
        const _taskId = captcha.createTask(
            values.websiteUrl,
            values.websitePublicKey
        )
        expect(warn).toBeCalledTimes(1)
        expect(_taskId).resolves.not.toBeUndefined()
        taskId = await _taskId
    })
    test("check task & createWithTask", async () => {
        const task = captcha.task({
            websitePublicKey: values.websitePublicKey,
            websiteURL: values.websiteUrl,
            cookies: captcha.convertCookies(utils.fakeCookies),
            data: values.blob,
        })
        expect(task.noCache ?? task.funcaptchaApiJSSubdomain).toBeUndefined()
        expect(task.cookies).toEqual(utils.expectedFakeCookies)
        expect(task.data).toEqual(values.blob)
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
