/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, spyOn } from "bun:test"
import path from "path"
import { CapmonsterError, ImageToTextTask } from "../src"
import { tasks } from "./utils/config.json"

const values = tasks.imagetotext
const regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

describe("ImageToTextTask", () => {
    test("prepareImageFromLocal returns valid base64", async () => {
        const captcha = new ImageToTextTask(process.env.API_KEY!)
        const numericImgPath = path.resolve(__dirname, values.numericPath)
        const textImgPath = path.resolve(__dirname, values.textPath)
        const numericImage = await captcha.prepareImageFromLocal(numericImgPath)
        const textImage = await captcha.prepareImageFromLocal(textImgPath)
        expect(numericImage.length).toBeGreaterThan(0)
        expect(textImage.length).toBeGreaterThan(0)
        expect(textImage).toMatch(regex)
        expect(numericImage).toMatch(regex)
    })

    test("prepareImageFromLink returns valid base64", async () => {
        const captcha = new ImageToTextTask(process.env.API_KEY!)
        const externalImage = await captcha.prepareImageFromLink(
            values.externalImageLink
        )
        expect(externalImage).toMatch(regex)
    })

    test("createTask (deprecated) warns and returns taskId", async () => {
        const warn = spyOn(console, "warn").mockReset()
        const captcha = new ImageToTextTask(process.env.API_KEY!)
        const body = await captcha.prepareImageFromLocal(
            path.resolve(__dirname, values.numericPath)
        )
        const taskId = await captcha.createTask(body, undefined, 95, undefined, 1)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(taskId).toBeGreaterThan(0)
    })

    test("createWithTask + joinTaskResult solves numeric image", async () => {
        const captcha = new ImageToTextTask(process.env.API_KEY!)
        const body = await captcha.prepareImageFromLocal(
            path.resolve(__dirname, values.numericPath)
        )
        try {
            const taskId = await captcha.createWithTask(
                captcha.task({ body, recognizingThreshold: 95 })
            )
            expect(taskId).toBeGreaterThan(0)
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("text")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })

    test("createWithTask + joinTaskResult solves text image", async () => {
        const captcha = new ImageToTextTask(process.env.API_KEY!)
        const body = await captcha.prepareImageFromLocal(
            path.resolve(__dirname, values.textPath)
        )
        try {
            const taskId = await captcha.createWithTask(
                captcha.task({ body, recognizingThreshold: 95 })
            )
            expect(taskId).toBeGreaterThan(0)
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("text")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })

    test("createWithTask + joinTaskResult solves external image", async () => {
        const captcha = new ImageToTextTask(process.env.API_KEY!)
        const body = await captcha.prepareImageFromLink(
            values.externalImageLink
        )
        try {
            const taskId = await captcha.createWithTask(
                captcha.task({ body, recognizingThreshold: 95 })
            )
            expect(taskId).toBeGreaterThan(0)
            const result = await captcha.joinTaskResult(taskId)
            expect(result).toHaveProperty("text")
        } catch (err) {
            expect(err).toBeInstanceOf(CapmonsterError)
        }
    })
})
