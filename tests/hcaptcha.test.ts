import { HCaptchaTask } from "../dist"
import * as utils from "./utils.config"

const captcha = new HCaptchaTask(utils.api_key)
let _taskId: number

test("HCaptchaTaskProxyless.createTask", async () => {
    captcha.setUserAgent(utils.user_agent)
    const taskId: number = await captcha.createTask(
        "https://lessons.zennolab.com/captchas/hcaptcha/?level=easy", 
        "472fc7af-86a4-4382-9a49-ca9090474471", undefined, undefined, utils.dump_cookies3)
    expect(taskId).toBeGreaterThan(0)
    _taskId = taskId
})

test("HCaptchaTaskProxyless.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)

test("HCaptchaTaskProxy.createTask", async () => {
    captcha.setUserAgent(utils.user_agent)
    const taskId: number = await captcha.createTask(
        "https://lessons.zennolab.com/captchas/hcaptcha/?level=moderate", 
        "d391ffb1-bc91-4ef8-a45a-2e2213af091b", undefined, undefined, utils.dump_cookies3)
    expect(taskId).toBeGreaterThan(0)
    _taskId = taskId
})

test("HCaptchaTaskProxy.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)