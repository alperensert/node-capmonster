/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "bun:test"
import { RecaptchaV3Task } from "../src"
import { tasks } from "./utils/config.json"

const values = tasks.reCaptchaV3

describe("RecaptchaV3Task", () => {
    test("task() builds correct config", () => {
        const captcha = new RecaptchaV3Task(process.env.API_KEY!)
        const task = captcha.task({
            websiteKey: values.websiteKey,
            websiteURL: values.websiteUrl,
        })
        expect(task.pageAction ?? task.noCache ?? task.minScore).toBeUndefined()
    })

    test("createWithTask returns valid taskId", async () => {
        const captcha = new RecaptchaV3Task(process.env.API_KEY!)
        const taskId = await captcha.createWithTask(
            captcha.task({
                websiteKey: values.websiteKey,
                websiteURL: values.websiteUrl,
            })
        )
        expect(taskId).toBeGreaterThan(0)
    })
})
