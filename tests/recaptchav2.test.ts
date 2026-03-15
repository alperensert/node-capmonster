/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, spyOn } from "bun:test"
import { CapmonsterError, RecaptchaV2Task } from "../src"
import { tasks, utils } from "./utils/config.json"

const values = tasks.reCaptchaV2

describe("RecaptchaV2Task", () => {
    test("createTask (deprecated) warns and returns taskId", async () => {
        const warn = spyOn(console, "warn").mockReset()
        const captcha = new RecaptchaV2Task(process.env.API_KEY!)
        const taskId = await captcha.createTask(
            values.websiteUrl,
            values.websiteKey
        )
        expect(warn).toHaveBeenCalledTimes(1)
        expect(taskId).toBeGreaterThan(0)
    })

    test("task() builds correct config", () => {
        const captcha = new RecaptchaV2Task(process.env.API_KEY!)
        const task = captcha.task({
            websiteKey: values.websiteKey,
            websiteURL: values.websiteUrl,
            cookies: captcha.convertCookies(utils.fakeCookies),
        })
        expect(task.cookies).toEqual(utils.expectedFakeCookies)
        expect(task.noCache).toBeUndefined()
        expect(task.recaptchaDataSValue).toBeUndefined()
    })

    test("createWithTask + joinTaskResult solves captcha", async () => {
        const captcha = new RecaptchaV2Task(process.env.API_KEY!)
        const task = captcha.task({
            websiteKey: values.websiteKey,
            websiteURL: values.websiteUrl,
        })
        try {
            const taskId = await captcha.createWithTask(task)
            expect(taskId).toBeGreaterThan(0)
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("gRecaptchaResponse")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })

    test("getTaskResult returns null or solution", async () => {
        const captcha = new RecaptchaV2Task(process.env.API_KEY!)
        const taskId = await captcha.createWithTask(
            captcha.task({
                websiteKey: values.websiteKey,
                websiteURL: values.websiteUrl,
            })
        )
        const result = await captcha.getTaskResult(taskId)
        // Either null (still processing) or has the solution
        if (result !== null) {
            expect(result).toHaveProperty("gRecaptchaResponse")
        } else {
            expect(result).toBeNull()
        }
    })
})
