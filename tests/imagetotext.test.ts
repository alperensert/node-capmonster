// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types.d.ts" />
import path from "path"
import { CapmonsterError, ImageToTextTask } from "../src"
import { tasks } from "./utils/config.json"

global.fetch = fetch

describe("ImageToTextTask", () => {
    const images: jest.ImageToTextImages = {
        numericImage: "",
        textImage: "",
        externalImage: "",
    }
    const taskIds: jest.ImageToTextTaskIds = {
        numericImage: 0,
        externalImage: 0,
        textImage: 0,
    }
    const warn = jest.spyOn(global.console, "warn")
    let captcha: ImageToTextTask
    const values = tasks.imagetotext
    const regex =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    beforeEach(() => (captcha = new ImageToTextTask(process.env.API_KEY)))
    test("check prepareImageFromLocal", async () => {
        const numericImgPath = path.resolve(__dirname, values.numericPath)
        const textImgPath = path.resolve(__dirname, values.textPath)
        images.numericImage = await captcha.prepareImageFromLocal(
            numericImgPath
        )
        images.textImage = await captcha.prepareImageFromLocal(textImgPath)
        expect(images.numericImage.length).toBeGreaterThan(0)
        expect(images.textImage.length).toBeGreaterThan(0)
        expect(images.textImage).toMatch(regex)
        expect(images.numericImage).toMatch(regex)
    })
    test("check prepareImageFromLink", async () => {
        images.externalImage = await captcha.prepareImageFromLink(
            values.externalImageLink
        )
        expect(images.externalImage).toMatch(regex)
    })
    test("check createTask", async () => {
        warn.mockReset()
        const _taskId = await captcha.createTask(
            images.numericImage,
            undefined,
            95,
            undefined,
            1
        )
        expect(warn).toBeCalledTimes(1)
        expect(_taskId).not.toBeUndefined()
        taskIds.numericImage = _taskId
    })
    test("check task & createWithTask", async () => {
        const externalImageTask = captcha.task({
            body: images.externalImage,
            recognizingThreshold: 95,
        })
        const textImageTask = captcha.task({
            body: images.textImage,
            recognizingThreshold: 95,
        })
        taskIds.externalImage = await captcha.createWithTask(externalImageTask)
        taskIds.textImage = await captcha.createWithTask(textImageTask)
        expect(taskIds.externalImage).not.toBe(0)
        expect(taskIds.textImage).not.toBe(0)
    })
    test("check results", () => {
        const external = captcha.joinTaskResult(taskIds.externalImage)
        const numeric = captcha.joinTaskResult(taskIds.numericImage)
        const text = captcha.joinTaskResult(taskIds.textImage)
        Promise.all([external, numeric, text]).catch((err) =>
            expect(err).toBeInstanceOf(CapmonsterError)
        )
    })
})
