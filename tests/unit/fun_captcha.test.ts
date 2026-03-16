/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { FuncaptchaTask } from "../../src"

describe("FuncaptchaTask - Unit", () => {
    let client: FuncaptchaTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new FuncaptchaTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websitePublicKey: "public-key-123",
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.websitePublicKey).toBe("public-key-123")
    })

    test("createWithTask sends FunCaptchaTaskProxyless without proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 300 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websitePublicKey: "public-key-123",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("FunCaptchaTaskProxyless")
    })

    test("getTaskResult returns solution", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: { token: "funcaptcha-token-abc" },
            },
        })
        const result = await client.getTaskResult(300)
        expect(result).not.toBeNull()
        expect(result!.token).toBe("funcaptcha-token-abc")
    })
})
