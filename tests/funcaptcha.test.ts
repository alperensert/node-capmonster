/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, spyOn } from "bun:test"
import { CapmonsterError, FuncaptchaTask } from "../src"
import { tasks, utils } from "./utils/config.json"

const values = tasks.funcaptcha

describe("FuncaptchaTask", () => {
    test("createTask (deprecated) warns and returns taskId", async () => {
        const warn = spyOn(console, "warn").mockReset()
        const captcha = new FuncaptchaTask(process.env.API_KEY!)
        const taskId = await captcha.createTask(
            values.websiteUrl,
            values.websitePublicKey
        )
        expect(warn).toHaveBeenCalledTimes(1)
        expect(taskId).toBeGreaterThan(0)
    })

    test("task() builds correct config with blob", () => {
        const captcha = new FuncaptchaTask(process.env.API_KEY!)
        const task = captcha.task({
            websitePublicKey: values.websitePublicKey,
            websiteURL: values.websiteUrl,
            cookies: captcha.convertCookies(utils.fakeCookies),
            data: values.blob,
        })
        expect(
            task.noCache ?? task.funcaptchaApiJSSubdomain
        ).toBeUndefined()
        expect(task.cookies).toEqual(utils.expectedFakeCookies)
        expect(task.data).toEqual(values.blob)
    })

    test("createWithTask + joinTaskResult solves captcha", async () => {
        const captcha = new FuncaptchaTask(process.env.API_KEY!)
        const task = captcha.task({
            websitePublicKey: values.websitePublicKey,
            websiteURL: values.websiteUrl,
        })
        try {
            const taskId = await captcha.createWithTask(task)
            expect(taskId).toBeGreaterThan(0)
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("token")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })
})
