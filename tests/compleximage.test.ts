/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "bun:test"
import { CapmonsterError, ComplexImageTask } from "../src"
import { tasks } from "./utils/config.json"

describe("ComplexImageTask", () => {
    test("task() builds correct config", () => {
        const captcha = new ComplexImageTask(process.env.API_KEY!)
        const task = captcha.task({
            class: "recaptcha",
            imageUrls: tasks.compleximageRecaptcha.imageUrls,
            metadata: {
                Task: tasks.compleximageRecaptcha.task,
            },
        })
        expect(task.imagesBase64).toBeUndefined()
        expect(task.metadata.Grid).toBeUndefined()
    })

    test("createWithTask + joinTaskResult solves captcha", async () => {
        const captcha = new ComplexImageTask(process.env.API_KEY!)
        const task = captcha.task({
            class: "recaptcha",
            imageUrls: tasks.compleximageRecaptcha.imageUrls,
            metadata: {
                Task: tasks.compleximageRecaptcha.task,
            },
        })
        try {
            const taskId = await captcha.createWithTask(task)
            expect(taskId).toBeGreaterThan(0)
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("answer")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })

    test("getTaskResult returns null or solution", async () => {
        const captcha = new ComplexImageTask(process.env.API_KEY!)
        const taskId = await captcha.createWithTask(
            captcha.task({
                class: "recaptcha",
                imageUrls: tasks.compleximageRecaptcha.imageUrls,
                metadata: {
                    Task: tasks.compleximageRecaptcha.task,
                },
            })
        )
        const result = await captcha.getTaskResult(taskId)
        if (result !== null) {
            expect(result).toHaveProperty("answer")
        } else {
            expect(result).toBeNull()
        }
    })
})
