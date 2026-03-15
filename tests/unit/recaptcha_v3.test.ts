/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { RecaptchaV3Task } from "../../src"

describe("RecaptchaV3Task - Unit", () => {
    let client: RecaptchaV3Task
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new RecaptchaV3Task("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() accepts isEnterprise parameter", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "site-key",
            isEnterprise: true,
        })
        expect(task.isEnterprise).toBe(true)
    })

    test("createWithTask sends isEnterprise", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 700 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "site-key",
            isEnterprise: true,
            minScore: 0.7,
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV3TaskProxyless")
        expect(sentData.task.isEnterprise).toBe(true)
        expect(sentData.task.minScore).toBe(0.7)
    })

    test("createWithTask without isEnterprise", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 701 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "site-key",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.isEnterprise).toBeUndefined()
    })
})
