/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, spyOn } from "bun:test"
import { CapmonsterError, TurnstileTask } from "../src"
import { tasks } from "./utils/config.json"

const values = tasks.turnstile

describe("TurnstileTask", () => {
    test("createTask (deprecated) warns and returns taskId", async () => {
        const warn = spyOn(console, "warn").mockReset()
        const captcha = new TurnstileTask(process.env.API_KEY!)
        const taskId = await captcha.createTask(
            values.websiteUrl,
            values.websiteKey
        )
        expect(warn).toHaveBeenCalledTimes(1)
        expect(taskId).toBeGreaterThan(0)
    })

    test("task() builds correct config", () => {
        const captcha = new TurnstileTask(process.env.API_KEY!)
        const task = captcha.task({
            websiteKey: values.websiteKey,
            websiteURL: values.websiteUrl,
        })
        expect(task.cloudflareTaskType).toBeUndefined()
        expect(task.pageAction).toBeUndefined()
    })

    test("createWithTask + joinTaskResult solves captcha", async () => {
        const captcha = new TurnstileTask(process.env.API_KEY!)
        const task = captcha.task({
            websiteKey: values.websiteKey,
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
