/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "bun:test"
import { TurnstileTask } from "../src"
import { tasks } from "./utils/config.json"

const values = tasks.turnstile

describe("TurnstileTask", () => {
    test("task() builds correct config", () => {
        const captcha = new TurnstileTask(process.env.API_KEY!)
        const task = captcha.task({
            websiteKey: values.websiteKey,
            websiteURL: values.websiteUrl,
        })
        expect(task.cloudflareTaskType).toBeUndefined()
        expect(task.pageAction).toBeUndefined()
    })

    test("createWithTask returns valid taskId", async () => {
        const captcha = new TurnstileTask(process.env.API_KEY!)
        const taskId = await captcha.createWithTask(
            captcha.task({
                websiteKey: values.websiteKey,
                websiteURL: values.websiteUrl,
            })
        )
        expect(taskId).toBeGreaterThan(0)
    })
})
