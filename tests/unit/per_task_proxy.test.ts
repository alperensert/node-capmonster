/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest, spyOn } from "bun:test"
import {
    RecaptchaV2Task,
    TurnstileTask,
    DataDomeTask,
    ImpervaTask,
    BinanceTask,
    FuncaptchaTask,
} from "../../src"

describe("Per-task proxy - Pattern A (standard tasks)", () => {
    let client: RecaptchaV2Task
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new RecaptchaV2Task("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("per-task proxy is used and type is not Proxyless", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 1 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
            proxy: {
                proxyType: "http",
                proxyAddress: "1.2.3.4",
                proxyPort: 8080,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV2Task")
        expect(sentData.task.proxyType).toBe("http")
        expect(sentData.task.proxyAddress).toBe("1.2.3.4")
        expect(sentData.task.proxyPort).toBe(8080)
    })

    test("per-task proxy with auth credentials", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 2 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
            proxy: {
                proxyType: "socks5",
                proxyAddress: "10.0.0.1",
                proxyPort: 1080,
                proxyLogin: "user",
                proxyPassword: "pass",
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.proxyType).toBe("socks5")
        expect(sentData.task.proxyLogin).toBe("user")
        expect(sentData.task.proxyPassword).toBe("pass")
    })

    test("per-task proxy overrides global proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 3 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "global.proxy",
            proxyPort: 9999,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
            proxy: {
                proxyType: "socks5",
                proxyAddress: "task.proxy",
                proxyPort: 1111,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.proxyType).toBe("socks5")
        expect(sentData.task.proxyAddress).toBe("task.proxy")
        expect(sentData.task.proxyPort).toBe(1111)
    })

    test("falls back to global proxy when no per-task proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 4 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "global.proxy",
            proxyPort: 9999,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV2Task")
        expect(sentData.task.proxyAddress).toBe("global.proxy")
    })

    test("Proxyless when neither per-task nor global proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 5 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV2TaskProxyless")
        expect(sentData.task.proxyType).toBeUndefined()
    })

    test("proxy field is not included in the sent task payload", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 6 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
            proxy: {
                proxyType: "http",
                proxyAddress: "1.2.3.4",
                proxyPort: 8080,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.proxy).toBeUndefined()
    })

    test("task() preserves proxy field in config", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "key",
            proxy: {
                proxyType: "http",
                proxyAddress: "1.2.3.4",
                proxyPort: 8080,
            },
        })
        expect(task.proxy).toBeDefined()
        expect(task.proxy!.proxyType).toBe("http")
    })
})

describe("Per-task proxy - Pattern A (other tasks)", () => {
    test("TurnstileTask with per-task proxy", async () => {
        const client = new TurnstileTask("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 10 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "0x4AAA",
            proxy: {
                proxyType: "http",
                proxyAddress: "1.2.3.4",
                proxyPort: 8080,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("TurnstileTask")
        expect(sentData.task.proxyAddress).toBe("1.2.3.4")
        expect(sentData.task.proxy).toBeUndefined()
    })

    test("BinanceTask with per-task proxy", async () => {
        const client = new BinanceTask("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 11 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "bizId",
            validateId: "vid",
            proxy: {
                proxyType: "socks4",
                proxyAddress: "5.6.7.8",
                proxyPort: 1080,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("BinanceTask")
        expect(sentData.task.proxyType).toBe("socks4")
        expect(sentData.task.proxy).toBeUndefined()
    })

    test("FuncaptchaTask with per-task proxy", async () => {
        const client = new FuncaptchaTask("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 12 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websitePublicKey: "pk",
            proxy: {
                proxyType: "https",
                proxyAddress: "9.8.7.6",
                proxyPort: 443,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("FunCaptchaTask")
        expect(sentData.task.proxyType).toBe("https")
    })
})

describe("Per-task proxy - Pattern B (CustomTask)", () => {
    test("DataDomeTask with per-task proxy", async () => {
        const client = new DataDomeTask("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 20 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            metadata: {
                captchaUrl: "https://geo.captcha-delivery.com/captcha/?...",
                datadomeCookie: "datadome=abc",
            },
            proxy: {
                proxyType: "http",
                proxyAddress: "task.proxy",
                proxyPort: 3333,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.class).toBe("DataDome")
        expect(sentData.task.proxyAddress).toBe("task.proxy")
        expect(sentData.task.proxyPort).toBe(3333)
        expect(sentData.task.proxy).toBeUndefined()
    })

    test("DataDomeTask per-task proxy overrides global", async () => {
        const client = new DataDomeTask("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 21 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "global.proxy",
            proxyPort: 9999,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            metadata: {
                captchaUrl: "url",
                datadomeCookie: "cookie",
            },
            proxy: {
                proxyType: "socks5",
                proxyAddress: "task.proxy",
                proxyPort: 1111,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.proxyType).toBe("socks5")
        expect(sentData.task.proxyAddress).toBe("task.proxy")
    })

    test("ImpervaTask with per-task proxy", async () => {
        const client = new ImpervaTask("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 22 },
        })
        await client.createWithTask({
            websiteURL: "https://protected.com",
            metadata: {
                incapsulaScriptUrl: "url",
                incapsulaCookies: "cookies",
                reese84UrlEndpoint: "endpoint",
            },
            proxy: {
                proxyType: "http",
                proxyAddress: "task.proxy",
                proxyPort: 4444,
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.class).toBe("Imperva")
        expect(sentData.task.proxyAddress).toBe("task.proxy")
        expect(sentData.task.proxy).toBeUndefined()
    })
})

describe("Deprecation warnings", () => {
    test("setGlobalProxy emits deprecation warning", () => {
        const warn = spyOn(console, "warn").mockReset()
        const client = new RecaptchaV2Task("test-api-key")
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "1.2.3.4",
            proxyPort: 8080,
        })
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0][0]).toContain("deprecated")
        expect(warn.mock.calls[0][0]).toContain("removed")
    })

    test("unsetProxy emits deprecation warning", () => {
        const warn = spyOn(console, "warn").mockReset()
        const client = new RecaptchaV2Task("test-api-key")
        client.unsetProxy()
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0][0]).toContain("deprecated")
        expect(warn.mock.calls[0][0]).toContain("removed")
    })

    test("setGlobalProxy still works despite deprecation", async () => {
        const client = new RecaptchaV2Task("test-api-key")
        const mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 30 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "global.proxy",
            proxyPort: 8080,
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "key",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("RecaptchaV2Task")
        expect(sentData.task.proxyAddress).toBe("global.proxy")
    })
})
