/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { DataDomeTask } from "../../src"

describe("DataDomeTask - Unit", () => {
    let client: DataDomeTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new DataDomeTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            metadata: {
                htmlPageBase64: "base64html",
                captchaUrl: "https://geo.captcha-delivery.com/captcha/?...",
                datadomeCookie: "datadome=abc123",
            },
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.metadata.datadomeCookie).toBe("datadome=abc123")
    })

    test("createWithTask sends CustomTask with DataDome class and proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 500 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "1.2.3.4",
            proxyPort: 8080,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            metadata: {
                htmlPageBase64: "base64html",
                captchaUrl: "https://geo.captcha-delivery.com/captcha/?...",
                datadomeCookie: "datadome=abc123",
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.class).toBe("DataDome")
        expect(sentData.task.proxyType).toBe("http")
        expect(sentData.task.proxyAddress).toBe("1.2.3.4")
        expect(sentData.task.proxyPort).toBe(8080)
    })

    test("createWithTask does not append Proxyless to CustomTask type", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 500 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            metadata: {
                htmlPageBase64: "base64html",
                captchaUrl: "https://geo.captcha-delivery.com/captcha/?...",
                datadomeCookie: "datadome=abc123",
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
    })
})
