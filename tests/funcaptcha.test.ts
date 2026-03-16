/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "bun:test"
import { FuncaptchaTask } from "../src"
import { tasks, utils } from "./utils/config.json"

const values = tasks.funcaptcha

describe("FuncaptchaTask", () => {
    test("task() builds correct config with blob", () => {
        const captcha = new FuncaptchaTask(process.env.API_KEY!)
        const task = captcha.task({
            websitePublicKey: values.websitePublicKey,
            websiteURL: values.websiteUrl,
            cookies: captcha.convertCookies(utils.fakeCookies),
            data: values.blob,
        })
        expect(task.noCache ?? task.funcaptchaApiJSSubdomain).toBeUndefined()
        expect(task.cookies).toEqual(utils.expectedFakeCookies)
        expect(task.data).toEqual(values.blob)
    })

    test("createWithTask returns valid taskId", async () => {
        const captcha = new FuncaptchaTask(process.env.API_KEY!)
        const taskId = await captcha.createWithTask(
            captcha.task({
                websitePublicKey: values.websitePublicKey,
                websiteURL: values.websiteUrl,
            })
        )
        expect(taskId).toBeGreaterThan(0)
    })
})
