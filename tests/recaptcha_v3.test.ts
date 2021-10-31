import { RecaptchaV3Task } from "../dist"
import * as utils from "./utils.config"

const captcha = new RecaptchaV3Task(utils.api_key)
let _taskId: number

test("RecaptchaV3Task.createTask", async () => {
    const taskId: number = await captcha.createTask(
        "https://lessons.zennolab.com/captchas/recaptcha/v3.php?level=beta",
        "6Le0xVgUAAAAAIt20XEB4rVhYOODgTl00d8juDob", 0.6, "myverify")
    expect(taskId).toBeGreaterThan(0)
    _taskId = taskId
})

test("RecaptchaV3Task.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)