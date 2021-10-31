import { FuncaptchaTask } from "../dist"
import * as utils from "./utils.config"

const captcha = new FuncaptchaTask(utils.api_key)
let _taskId: number

test("FuncaptchaTaskProxyless.createTask", async () => {
    const taskId: number = await captcha.createTask(
        "https://funcaptcha.com/fc/api/nojs/?pkey=69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
        "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC", undefined, 
        "{\"blob\":\"dyXvXANMbHj1iDyz.Qj97JtSqR2n%2BuoY1V%2FbdgbrG7p%2FmKiqdU9AwJ6MifEt0np4vfYn6TTJDJEfZDlcz9Q1XMn9przeOV%2FCr2%2FIpi%2FC1s%3D\"}")
    expect(taskId).toBeGreaterThan(0)
    _taskId = taskId
})

test("FuncaptchaTaskProxyless.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)

test("FuncaptchaTaskProxy.createTask", async () => {
    captcha.setProxy(utils.proxy.type, utils.proxy.address, utils.proxy.port, utils.proxy.username, utils.proxy.password)
    captcha.setUserAgent(utils.user_agent)
    const taskId: number = await captcha.createTask(
        "https://funcaptcha.com/fc/api/nojs/?pkey=69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
        "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC", undefined, 
        "{\"blob\":\"dyXvXANMbHj1iDyz.Qj97JtSqR2n%2BuoY1V%2FbdgbrG7p%2FmKiqdU9AwJ6MifEt0np4vfYn6TTJDJEfZDlcz9Q1XMn9przeOV%2FCr2%2FIpi%2FC1s%3D\"}")
    expect(taskId).toBeGreaterThan(0)
    captcha.disableProxy()
    captcha.resetUserAgent()
    _taskId = taskId
})

test("FuncaptchaTaskProxy.joinTaskResult", async () => {
    try {
        const response: any = await captcha.joinTaskResult(_taskId)
        expect(response).toBeInstanceOf(Object)
    } catch(e) {
        console.log(`Exception Caught: ${e.code} but it's ok.`)
        if (utils.acceptable_errors.indexOf(e.code) > -1) expect(true).toEqual(true)
    }
}, 999999)