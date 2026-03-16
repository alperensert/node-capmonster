/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { RecaptchaV2Task } from "../../src"

describe("RecaptchaV2Task - Unit", () => {
    let client: RecaptchaV2Task
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new RecaptchaV2Task("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "site-key-123",
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.websiteKey).toBe("site-key-123")
        expect(task.isInvisible).toBeUndefined()
        expect(task.noCache).toBeUndefined()
    })

    test("task() accepts isInvisible parameter", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "site-key-123",
            isInvisible: true,
        })
        expect(task.isInvisible).toBe(true)
    })

    test("createWithTask sends RecaptchaV2Task type (not NoCaptchaTask)", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 12345 },
        })
        const taskId = await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "site-key-123",
        })
        expect(taskId).toBe(12345)
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV2TaskProxyless")
        expect(sentData.task.type).not.toContain("NoCaptcha")
    })

    test("createWithTask uses RecaptchaV2Task type with proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 12345 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "8.8.8.8",
            proxyPort: 8080,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "site-key-123",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV2Task")
        expect(sentData.task.proxyType).toBe("http")
        expect(sentData.task.proxyAddress).toBe("8.8.8.8")
        expect(sentData.task.proxyPort).toBe(8080)
    })

    test("createWithTask sends isInvisible when set", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 12345 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "site-key-123",
            isInvisible: true,
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.isInvisible).toBe(true)
    })

    test("getTaskResult returns solution", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: { gRecaptchaResponse: "token-123" },
            },
        })
        const result = await client.getTaskResult(123)
        expect(result).not.toBeNull()
        expect(result!.gRecaptchaResponse).toBe("token-123")
    })
})
