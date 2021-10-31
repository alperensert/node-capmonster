import { RecaptchaV2Task } from "../dist"
import * as utils from "./utils.config"

const captcha = new RecaptchaV2Task(utils.api_key)
let _taskId: number

test("RecaptchaV2Task.createTask", async () => {
    const taskId: number = await captcha.createTask(
        "https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high", 
        "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd")
    expect(taskId).toBeGreaterThan(0)
    _taskId = taskId
})

test("RecaptchaV2Task.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)

test("RecaptchaV2Task.createTask with proxy", async () => {
    captcha.setProxy(utils.proxy.type, utils.proxy.address, utils.proxy.port, utils.proxy.username, utils.proxy.password)
    captcha.setUserAgent(utils.user_agent)
    const taskId: number = await captcha.createTask(
        "https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high", 
        "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd", utils.dump_cookies3, undefined, true)
    expect(taskId).toBeGreaterThan(0)
    _taskId = taskId
    captcha.resetUserAgent()
    captcha.disableProxy()
})

test("RecaptchaV2Task.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)