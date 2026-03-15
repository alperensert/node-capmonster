/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { TurnstileTask } from "../../src"

describe("TurnstileTask - Unit", () => {
    let client: TurnstileTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new TurnstileTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure for standard Turnstile", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "0x4AAA",
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.websiteKey).toBe("0x4AAA")
        expect(task.cloudflareTaskType).toBeUndefined()
    })

    test("task() accepts Cloudflare Challenge token params", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "0x4AAA",
            cloudflareTaskType: "token",
            pageAction: "managed",
            data: "cdata-value",
            pageData: "chlPageData-value",
            userAgent: "Mozilla/5.0...",
        })
        expect(task.cloudflareTaskType).toBe("token")
        expect(task.pageAction).toBe("managed")
        expect(task.data).toBe("cdata-value")
        expect(task.pageData).toBe("chlPageData-value")
        expect(task.userAgent).toBe("Mozilla/5.0...")
    })

    test("task() accepts Cloudflare Challenge cf_clearance params", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "anything",
            cloudflareTaskType: "cf_clearance",
            htmlPageBase64: "base64html",
            userAgent: "Mozilla/5.0...",
        })
        expect(task.cloudflareTaskType).toBe("cf_clearance")
        expect(task.htmlPageBase64).toBe("base64html")
    })

    test("createWithTask sends correct type without proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 100 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "0x4AAA",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("TurnstileTaskProxyless")
    })

    test("createWithTask sends Cloudflare Challenge params with proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 100 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "1.2.3.4",
            proxyPort: 8080,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "0x4AAA",
            cloudflareTaskType: "cf_clearance",
            htmlPageBase64: "base64html",
            userAgent: "Mozilla/5.0...",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("TurnstileTask")
        expect(sentData.task.cloudflareTaskType).toBe("cf_clearance")
        expect(sentData.task.htmlPageBase64).toBe("base64html")
        expect(sentData.task.proxyType).toBe("http")
    })

    test("getTaskResult returns solution with cf_clearance", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    token: "token-value",
                    cf_clearance: "clearance-cookie",
                    userAgent: "UA",
                },
            },
        })
        const result = await client.getTaskResult(100)
        expect(result).not.toBeNull()
        expect(result!.token).toBe("token-value")
        expect(result!.cf_clearance).toBe("clearance-cookie")
    })
})
