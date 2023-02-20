/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
import { expect, jest, test } from "@jest/globals"
import {
    CapmonsterClient,
    ITask,
    IUserAgentTaskRequest,
    UAProxy,
} from "../src/capmonster"
import { RecaptchaV2Task } from "../src"
import { CapmonsterError } from "../src/capmonster_error"
import { utils } from "./utils/config.json"

describe("CapmonsterClient", () => {
    let captcha: CapmonsterClient
    beforeEach(() => {
        captcha = new CapmonsterClient(process.env.API_KEY)
    })
    test("with valid api key", async () => {
        const balance = await captcha.getBalance()
        expect(balance).toBeGreaterThanOrEqual(0)
    })
    test("with invalid api key", async () => {
        captcha.clientKey = utils.fakeApiKey
        const balance = captcha.getBalance()
        await expect(balance).rejects.toThrowError(CapmonsterError)
    })
    test("with invalid taskId", () => {
        const _captcha = new RecaptchaV2Task(process.env.API_KEY)
        const result = _captcha.getTaskResult(99)
        expect(result).rejects.toThrowError(CapmonsterError)
    })
    test("check stringCookies is parsing as expected", () => {
        const cookies = captcha.convertCookies(utils.fakeCookies)
        expect(cookies).toBe(utils.expectedFakeCookies)
    })
    test("check addCookies is parsing as expected", () => {
        const cookies: unknown[] = []
        const fakeCookies = [
            utils.fakeCookies,
            utils.fakeCookiesArray,
            utils.fakeCookiesString,
        ]
        fakeCookies.forEach((v) =>
            cookies.push((captcha as any)["addCookies"](v))
        )
        cookies.forEach((v) => expect(v).toBe(utils.expectedFakeCookies))
    })
    test("check addCookies with wrong length array", () => {
        const cookie = ["thisisbad", ...utils.fakeCookiesArray]
        const addCookies = (captcha as any)["addCookies"]
        expect(() => addCookies(cookie)).toThrowError(Error)
    })
    test("check setCallbackUrl & unsetCallbackUrl", () => {
        captcha.setCallbackUrl(utils.callbackUrl)
        let callbackUrl = (captcha as any)["callbackUrl"]
        expect(callbackUrl).toBe(utils.callbackUrl)
        captcha.unsetCallbackUrl()
        callbackUrl = (captcha as any)["callbackUrl"]
        expect(callbackUrl).toBeUndefined()
    })
})

describe("UAProxy", () => {
    const warn = jest.spyOn(global.console, "warn")
    let captcha: UAProxy
    beforeEach(() => (captcha = new UAProxy(process.env.API_KEY)))
    test("check function setProxy & disableProxy", () => {
        warn.mockReset()
        captcha.setProxy("https", "127.0.0.1", 61)
        expect(warn).toHaveBeenCalledTimes(1)
        expect((captcha as any).proxy).toEqual({
            proxyType: "https",
            proxyAddress: "127.0.0.1",
            proxyPort: 61,
            proxyLogin: undefined,
            proxyPassword: undefined,
        })
        captcha.disableProxy()
        expect(warn).toHaveBeenCalledTimes(2)
        expect((captcha as any).proxy).toEqual({})
    })
    test("check function setGlobalProxy & unsetProxy", () => {
        captcha.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "127.0.0.61",
            proxyPort: 99,
            proxyLogin: "alperen",
        })
        expect((captcha as any).proxy).toEqual({
            proxyType: "http",
            proxyAddress: "127.0.0.61",
            proxyPort: 99,
            proxyLogin: "alperen",
            proxyPassword: undefined,
        })
        captcha.unsetProxy()
        expect((captcha as any).proxy).toEqual({})
    })
    test("check function setUserAgent & resetUserAgent", () => {
        warn.mockReset()
        captcha.setUserAgent(utils.userAgent)
        expect((captcha as any).userAgent).toEqual({
            userAgent: utils.userAgent,
        })
        captcha.resetUserAgent()
        expect(warn).toHaveBeenCalledTimes(1)
        expect((captcha as any).userAgent).toEqual({})
    })
    test("check function unsetUserAgent", () => {
        captcha.setUserAgent(utils.userAgent)
        expect((captcha as any).userAgent).toEqual({
            userAgent: utils.userAgent,
        })
        captcha.unsetUserAgent()
        expect((captcha as any).userAgent).toEqual({})
    })
    test("check isProxyTask", () => {
        const task: ITask = {
            type: "ReCaptchaV2_jstkidding",
        }
        captcha.setGlobalProxy({
            proxyType: "https",
            proxyAddress: "127.0.0.1",
            proxyPort: 5001,
        })
        const [data, isProxyTask] = (captcha as any)["isProxyTask"](task)
        expect((data as ITask).type).not.toContain("Proxyless")
        expect(isProxyTask as boolean).toBe(true)
    })
    test("check isUserAgentTask", () => {
        const task: ITask = {
            type: "ReCaptchaV2_jstkidding",
        }
        captcha.setUserAgent(utils.userAgent)
        const [data, isUserAgentTask] = (captcha as any)["isUserAgentTask"](
            task
        )
        expect((data as ITask & IUserAgentTaskRequest).userAgent).toBe(
            utils.userAgent
        )
        expect(isUserAgentTask as boolean).toBe(true)
    })
    test("check isProxyTask +Proxyless", () => {
        const taskType = "ReCaptchaV2_jstkidding"
        const task: ITask = {
            type: taskType,
        }
        const [data, isProxyTask] = (captcha as any)["isProxyTask"](task)
        expect((data as ITask).type).toContain("Proxyless")
        expect(isProxyTask as boolean).toBe(false)
    })
})
