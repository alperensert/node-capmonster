/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "bun:test"
import path from "path"
import {
    RecaptchaV2Task,
    RecaptchaV3Task,
    TurnstileTask,
    FuncaptchaTask,
    ImageToTextTask,
    ComplexImageTask,
    CapmonsterError,
} from "../src"
import { tasks } from "./utils/config.json"

const SOLVE_TIMEOUT = 60 // seconds per task

/**
 * All captcha solve tests run concurrently within a single test block.
 * This avoids sequential blocking — all tasks are created and polled in parallel.
 */
describe("Solve captchas (parallel)", () => {
    test(
        "all captcha types solve concurrently",
        async () => {
            const results = await Promise.allSettled([
                solveRecaptchaV2(),
                solveRecaptchaV3(),
                solveTurnstile(),
                solveFuncaptcha(),
                solveImageNumeric(),
                solveImageText(),
                solveComplexImage(),
            ])

            const summary = [
                "RecaptchaV2",
                "RecaptchaV3",
                "Turnstile",
                "FunCaptcha",
                "ImageNumeric",
                "ImageText",
                "ComplexImage",
            ]

            let passed = 0
            for (let i = 0; i < results.length; i++) {
                const r = results[i]
                if (r.status === "fulfilled") {
                    passed++
                } else {
                    // Only CapmonsterError is acceptable as a failure
                    expect(r.reason).toBeInstanceOf(CapmonsterError)
                    console.warn(`${summary[i]} failed: ${r.reason.message}`)
                }
            }
            // At least some should succeed
            expect(passed).toBeGreaterThan(0)
        },
        SOLVE_TIMEOUT * 1000 + 30000
    )
})

async function solveRecaptchaV2() {
    const client = new RecaptchaV2Task(process.env.API_KEY!)
    const taskId = await client.createWithTask(
        client.task({
            websiteURL: tasks.reCaptchaV2.websiteUrl,
            websiteKey: tasks.reCaptchaV2.websiteKey,
        })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("gRecaptchaResponse")
    return result
}

async function solveRecaptchaV3() {
    const client = new RecaptchaV3Task(process.env.API_KEY!)
    const taskId = await client.createWithTask(
        client.task({
            websiteURL: tasks.reCaptchaV3.websiteUrl,
            websiteKey: tasks.reCaptchaV3.websiteKey,
        })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("gRecaptchaResponse")
    return result
}

async function solveTurnstile() {
    const client = new TurnstileTask(process.env.API_KEY!)
    const taskId = await client.createWithTask(
        client.task({
            websiteURL: tasks.turnstile.websiteUrl,
            websiteKey: tasks.turnstile.websiteKey,
        })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("token")
    return result
}

async function solveFuncaptcha() {
    const client = new FuncaptchaTask(process.env.API_KEY!)
    const taskId = await client.createWithTask(
        client.task({
            websiteURL: tasks.funcaptcha.websiteUrl,
            websitePublicKey: tasks.funcaptcha.websitePublicKey,
        })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("token")
    return result
}

async function solveImageNumeric() {
    const client = new ImageToTextTask(process.env.API_KEY!)
    const body = await client.prepareImageFromLocal(
        path.resolve(__dirname, tasks.imagetotext.numericPath)
    )
    const taskId = await client.createWithTask(
        client.task({ body, recognizingThreshold: 95 })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("text")
    return result
}

async function solveImageText() {
    const client = new ImageToTextTask(process.env.API_KEY!)
    const body = await client.prepareImageFromLocal(
        path.resolve(__dirname, tasks.imagetotext.textPath)
    )
    const taskId = await client.createWithTask(
        client.task({ body, recognizingThreshold: 95 })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("text")
    return result
}

async function solveComplexImage() {
    const client = new ComplexImageTask(process.env.API_KEY!)
    const taskId = await client.createWithTask(
        client.task({
            class: "recaptcha",
            imageUrls: tasks.compleximageRecaptcha.imageUrls,
            metadata: {
                Task: tasks.compleximageRecaptcha.task,
            },
        })
    )
    expect(taskId).toBeGreaterThan(0)
    const result = await client.joinTaskResult(taskId, SOLVE_TIMEOUT)
    expect(result).toHaveProperty("answer")
    return result
}
