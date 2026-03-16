/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "bun:test"
import { RecaptchaV2Task } from "../src"
import { tasks, utils } from "./utils/config.json"

const values = tasks.reCaptchaV2

describe("RecaptchaV2Task", () => {
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

    test("createWithTask returns valid taskId", async () => {
        const captcha = new RecaptchaV2Task(process.env.API_KEY!)
        const taskId = await captcha.createWithTask(
            captcha.task({
                websiteKey: values.websiteKey,
                websiteURL: values.websiteUrl,
            })
        )
        expect(taskId).toBeGreaterThan(0)
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
        if (result !== null) {
            expect(result).toHaveProperty("gRecaptchaResponse")
        } else {
            expect(result).toBeNull()
        }
    })
})
