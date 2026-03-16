/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { ImageToTextTask } from "../../src"

describe("ImageToTextTask - Unit", () => {
    let client: ImageToTextTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new ImageToTextTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure with body", () => {
        const task = client.task({
            body: "base64encodedimage",
        })
        expect(task.body).toBe("base64encodedimage")
    })

    test("task() accepts all optional fields", () => {
        const task = client.task({
            body: "base64encodedimage",
            CapMonsterModule: "yandex",
            recognizingThreshold: 90,
            Case: true,
            numeric: 1,
            math: true,
        })
        expect(task.body).toBe("base64encodedimage")
        expect(task.CapMonsterModule).toBe("yandex")
        expect(task.recognizingThreshold).toBe(90)
        expect(task.Case).toBe(true)
        expect(task.numeric).toBe(1)
        expect(task.math).toBe(true)
    })

    test("createWithTask sends ImageToTextTask type", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 1000 },
        })
        await client.createWithTask({
            body: "base64encodedimage",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("ImageToTextTask")
        expect(sentData.task.body).toBe("base64encodedimage")
    })

    test("getTaskResult returns text field", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: { text: "captcha-answer" },
            },
        })
        const result = await client.getTaskResult(1000)
        expect(result).not.toBeNull()
        expect(result!.text).toBe("captcha-answer")
    })
})
