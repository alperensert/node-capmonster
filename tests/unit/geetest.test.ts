/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { GeeTestTask, GeeTestV4Task } from "../../src"

describe("GeeTestTask - Unit", () => {
    let client: GeeTestTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new GeeTestTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            gt: "gt-key-123",
            challenge: "challenge-abc",
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.gt).toBe("gt-key-123")
        expect(task.challenge).toBe("challenge-abc")
    })

    test("createWithTask sends GeeTestTaskProxyless without proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 900 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            gt: "gt-key-123",
            challenge: "challenge-abc",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("GeeTestTaskProxyless")
    })

    test("createWithTask sends GeeTestTask with per-task proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 901 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            gt: "gt-key-123",
            challenge: "challenge-abc",
            proxy: {
                proxyType: "http",
                proxyAddress: "1.2.3.4",
                proxyPort: 8080,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("GeeTestTask")
        expect(sentData.task.proxyType).toBe("http")
        expect(sentData.task.proxyAddress).toBe("1.2.3.4")
        expect(sentData.task.proxyPort).toBe(8080)
    })

    test("getTaskResult returns challenge, validate, seccode", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    challenge: "challenge-resp",
                    validate: "validate-resp",
                    seccode: "seccode-resp",
                },
            },
        })
        const result = await client.getTaskResult(900)
        expect(result).not.toBeNull()
        expect(result!.challenge).toBe("challenge-resp")
        expect(result!.validate).toBe("validate-resp")
        expect(result!.seccode).toBe("seccode-resp")
    })
})

describe("GeeTestV4Task - Unit", () => {
    let client: GeeTestV4Task
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new GeeTestV4Task("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            gt: "gt-v4-key",
            initParameters: { captcha_id: "abc123" },
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.gt).toBe("gt-v4-key")
        expect(task.initParameters).toEqual({ captcha_id: "abc123" })
    })

    test("createWithTask sends GeeTestTaskProxyless with version 4", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 950 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            gt: "gt-v4-key",
            initParameters: { captcha_id: "abc123" },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("GeeTestTaskProxyless")
        expect(sentData.task.version).toBe(4)
    })

    test("getTaskResult returns v4 solution fields", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    captcha_id: "id-123",
                    lot_number: "lot-456",
                    pass_token: "token-789",
                    gen_time: "1234567890",
                    captcha_output: "output-abc",
                },
            },
        })
        const result = await client.getTaskResult(950)
        expect(result).not.toBeNull()
        expect(result!.captcha_id).toBe("id-123")
        expect(result!.lot_number).toBe("lot-456")
        expect(result!.pass_token).toBe("token-789")
        expect(result!.gen_time).toBe("1234567890")
        expect(result!.captcha_output).toBe("output-abc")
    })
})
