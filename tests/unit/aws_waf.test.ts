/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { AmazonTask } from "../../src"

describe("AmazonTask - Unit", () => {
    let client: AmazonTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new AmazonTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() allows standard mode without challenge fields", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "aws-key",
            captchaScript: "https://example.com/captcha.js",
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.challengeScript).toBeUndefined()
        expect(task.context).toBeUndefined()
        expect(task.iv).toBeUndefined()
    })

    test("task() allows challenge mode with all fields", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "aws-key",
            captchaScript: "https://example.com/captcha.js",
            challengeScript: "https://example.com/challenge.js",
            context: "ctx-value",
            iv: "iv-value",
            cookieSolution: true,
        })
        expect(task.challengeScript).toBe("https://example.com/challenge.js")
        expect(task.context).toBe("ctx-value")
        expect(task.iv).toBe("iv-value")
        expect(task.cookieSolution).toBe(true)
    })

    test("createWithTask sends AmazonTaskProxyless without proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 400 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "aws-key",
            captchaScript: "https://example.com/captcha.js",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("AmazonTaskProxyless")
    })

    test("createWithTask sends AmazonTask with proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 400 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "5.5.5.5",
            proxyPort: 3128,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "aws-key",
            captchaScript: "https://example.com/captcha.js",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("AmazonTask")
        expect(sentData.task.proxyType).toBe("http")
    })

    test("getTaskResult returns cookie solution", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    cookies: { "aws-waf-token": "token-value" },
                    userAgent: "Mozilla/5.0...",
                },
            },
        })
        const result = await client.getTaskResult(400)
        expect(result).not.toBeNull()
        expect(result!.cookies).toHaveProperty("aws-waf-token")
        expect(result!.userAgent).toBe("Mozilla/5.0...")
    })

    test("getTaskResult returns voucher solution", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    captcha_voucher: "voucher-123",
                    existing_token: "token-456",
                },
            },
        })
        const result = await client.getTaskResult(400)
        expect(result).not.toBeNull()
        expect(result!.captcha_voucher).toBe("voucher-123")
        expect(result!.existing_token).toBe("token-456")
    })
})
