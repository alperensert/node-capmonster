/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import axios from "axios"
import { CapmonsterError } from "../../src"
import { CapmonsterClient, UAProxy } from "../../src/capmonster"

describe("CapmonsterClient API Methods - Unit", () => {
    let client: CapmonsterClient
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new CapmonsterClient("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    describe("reportIncorrectImageCaptcha", () => {
        test("sends correct request", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, status: "success" },
            })
            await client.reportIncorrectImageCaptcha(12345)
            expect(mockPost).toHaveBeenCalledWith(
                "/reportIncorrectImageCaptcha",
                { clientKey: "test-api-key", taskId: 12345 }
            )
        })

        test("throws CapmonsterError on API error", async () => {
            mockPost.mockResolvedValueOnce({
                data: {
                    errorId: 1,
                    errorCode: "ERROR_KEY_DOES_NOT_EXIST",
                    errorDescription: "Invalid key",
                },
            })
            await expect(
                client.reportIncorrectImageCaptcha(12345)
            ).rejects.toThrow(CapmonsterError)
        })
    })

    describe("reportIncorrectTokenCaptcha", () => {
        test("sends correct request", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, status: "success" },
            })
            await client.reportIncorrectTokenCaptcha(67890)
            expect(mockPost).toHaveBeenCalledWith(
                "/reportIncorrectTokenCaptcha",
                { clientKey: "test-api-key", taskId: 67890 }
            )
        })

        test("throws CapmonsterError on API error", async () => {
            mockPost.mockResolvedValueOnce({
                data: {
                    errorId: 1,
                    errorCode: "ERROR_KEY_DOES_NOT_EXIST",
                    errorDescription: "Invalid key",
                },
            })
            await expect(
                client.reportIncorrectTokenCaptcha(67890)
            ).rejects.toThrow(CapmonsterError)
        })
    })

    describe("getUserAgent", () => {
        test("returns user agent string", async () => {
            const expectedUA =
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            const origGet = axios.get
            ;(axios as any).get = jest.fn().mockResolvedValueOnce({
                data: expectedUA,
            })
            const ua = await client.getUserAgent()
            expect(ua).toBe(expectedUA)
            ;(axios as any).get = origGet
        })
    })

    describe("getBalance", () => {
        test("returns balance", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, balance: 123.45 },
            })
            const balance = await client.getBalance()
            expect(balance).toBe(123.45)
        })

        test("throws on error", async () => {
            mockPost.mockResolvedValueOnce({
                data: {
                    errorId: 1,
                    errorCode: "ERROR_KEY_DOES_NOT_EXIST",
                    errorDescription: "Bad key",
                },
            })
            await expect(client.getBalance()).rejects.toThrow(CapmonsterError)
        })
    })

    describe("setTimeout", () => {
        test("sets valid timeout", () => {
            client.setTimeout(60)
            expect((client as any).timeout).toBe(60)
        })

        test("sets boundary timeout 1", () => {
            client.setTimeout(1)
            expect((client as any).timeout).toBe(1)
        })

        test("sets boundary timeout 300", () => {
            client.setTimeout(300)
            expect((client as any).timeout).toBe(300)
        })

        test("ignores invalid timeout (0)", () => {
            client.setTimeout(0)
            expect((client as any).timeout).toBe(120)
        })

        test("ignores negative timeout", () => {
            client.setTimeout(-10)
            expect((client as any).timeout).toBe(120)
        })

        test("ignores timeout > 300", () => {
            client.setTimeout(500)
            expect((client as any).timeout).toBe(120)
        })
    })

    describe("setCallbackUrl / unsetCallbackUrl", () => {
        test("sets callback url", () => {
            client.setCallbackUrl("https://example.com/callback")
            expect((client as any).callbackUrl).toBe(
                "https://example.com/callback"
            )
        })

        test("unsets callback url", () => {
            client.setCallbackUrl("https://example.com/callback")
            client.unsetCallbackUrl()
            expect((client as any).callbackUrl).toBeUndefined()
        })

        test("callback url is included in createTask payload", async () => {
            client.setCallbackUrl("https://example.com/callback")
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, taskId: 1 },
            })
            await (client as any)._createTask({ type: "TestTask" })
            const sentData = mockPost.mock.calls[0][1]
            expect(sentData.callbackUrl).toBe("https://example.com/callback")
        })

        test("callback url is undefined when not set", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, taskId: 1 },
            })
            await (client as any)._createTask({ type: "TestTask" })
            const sentData = mockPost.mock.calls[0][1]
            expect(sentData.callbackUrl).toBeUndefined()
        })
    })

    describe("convertCookies", () => {
        test("converts object cookies", () => {
            const result = client.convertCookies({
                session: "abc",
                token: "xyz",
            })
            expect(result).toBe("session=abc;token=xyz")
        })

        test("handles single cookie", () => {
            const result = client.convertCookies({ session: "abc" })
            expect(result).toBe("session=abc")
        })

        test("handles boolean and number values", () => {
            const result = client.convertCookies({
                flag: true,
                count: 42,
            })
            expect(result).toBe("flag=true;count=42")
        })
    })

    describe("_getTaskResult", () => {
        test("returns null when status is processing", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, status: "processing" },
            })
            const result = await (client as any)._getTaskResult(1)
            expect(result).toBeNull()
        })

        test("returns solution when status is ready", async () => {
            mockPost.mockResolvedValueOnce({
                data: {
                    errorId: 0,
                    status: "ready",
                    solution: { text: "answer" },
                },
            })
            const result = await (client as any)._getTaskResult(1)
            expect(result).toEqual({ text: "answer" })
        })

        test("throws on API error", async () => {
            mockPost.mockResolvedValueOnce({
                data: {
                    errorId: 1,
                    errorCode: "ERROR_CAPTCHA_UNSOLVABLE",
                    errorDescription: "Unsolvable",
                },
            })
            await expect((client as any)._getTaskResult(1)).rejects.toThrow(
                CapmonsterError
            )
        })
    })

    describe("_joinTaskResult", () => {
        test("throws ERROR_MAXIMUM_TIME_EXCEED on timeout", async () => {
            mockPost.mockResolvedValue({
                data: { errorId: 0, status: "processing" },
            })
            client.setTimeout(1)
            await expect((client as any)._joinTaskResult(1, 1)).rejects.toThrow(
                "ERROR_MAXIMUM_TIME_EXCEED"
            )
        })
    })

    describe("_createTask", () => {
        test("includes softId in payload", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, taskId: 99 },
            })
            await (client as any)._createTask({ type: "TestTask" })
            const sentData = mockPost.mock.calls[0][1]
            expect(sentData.softId).toBe(32)
        })

        test("includes clientKey in payload", async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, taskId: 99 },
            })
            await (client as any)._createTask({ type: "TestTask" })
            const sentData = mockPost.mock.calls[0][1]
            expect(sentData.clientKey).toBe("test-api-key")
        })
    })

    describe("constructor validateStatus", () => {
        test("axios instance is created with validateStatus accepting 2xx and 4xx", () => {
            const freshClient = new CapmonsterClient("key")
            const axiosInstance = (freshClient as any).request
            const validateStatus = axiosInstance.defaults.validateStatus
            expect(validateStatus(200)).toBe(true)
            expect(validateStatus(299)).toBe(true)
            expect(validateStatus(400)).toBe(true)
            expect(validateStatus(499)).toBe(true)
            expect(validateStatus(300)).toBe(false)
            expect(validateStatus(500)).toBe(false)
            expect(validateStatus(199)).toBe(false)
        })
    })

    describe("addCookies", () => {
        test("handles string input", () => {
            const result = (client as any)["addCookies"](
                "session=abc;token=xyz"
            )
            expect(result).toBe("session=abc;token=xyz")
        })

        test("handles array input (even length)", () => {
            const result = (client as any)["addCookies"]([
                "session",
                "abc",
                "token",
                "xyz",
            ])
            expect(result).toBe("session=abc;token=xyz")
        })

        test("handles object input", () => {
            const result = (client as any)["addCookies"]({
                session: "abc",
                token: "xyz",
            })
            expect(result).toBe("session=abc;token=xyz")
        })

        test("throws on odd-length array", () => {
            expect(() =>
                (client as any)["addCookies"](["session", "abc", "token"])
            ).toThrow("Array cookies length must be even numbers")
        })
    })
})

describe("UAProxy - Unit", () => {
    let uaClient: UAProxy
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        uaClient = new UAProxy("test-key")
        mockPost = jest.fn()
        ;(uaClient as any).request = { post: mockPost }
    })

    describe("setUserAgent", () => {
        test("sets user agent", () => {
            uaClient.setUserAgent("Mozilla/5.0 Test")
            expect((uaClient as any).userAgent).toEqual({
                userAgent: "Mozilla/5.0 Test",
            })
        })
    })

    describe("resetUserAgent (deprecated)", () => {
        test("resets user agent and warns", () => {
            const warnSpy = jest
                .spyOn(console, "warn")
                .mockImplementation(() => {})
            uaClient.setUserAgent("Mozilla/5.0 Test")
            uaClient.resetUserAgent()
            expect((uaClient as any).userAgent).toEqual({})
            expect(warnSpy).toHaveBeenCalled()
            warnSpy.mockRestore()
        })
    })

    describe("unsetUserAgent", () => {
        test("unsets user agent", () => {
            uaClient.setUserAgent("Mozilla/5.0 Test")
            uaClient.unsetUserAgent()
            expect((uaClient as any).userAgent).toEqual({})
        })
    })

    describe("setProxy (deprecated)", () => {
        test("sets proxy and warns", () => {
            const warnSpy = jest
                .spyOn(console, "warn")
                .mockImplementation(() => {})
            uaClient.setProxy("http", "1.2.3.4", 8080, "user", "pass")
            expect((uaClient as any).proxy).toEqual({
                proxyType: "http",
                proxyAddress: "1.2.3.4",
                proxyPort: 8080,
                proxyLogin: "user",
                proxyPassword: "pass",
            })
            expect(warnSpy).toHaveBeenCalled()
            warnSpy.mockRestore()
        })
    })

    describe("disableProxy (deprecated)", () => {
        test("disables proxy and warns", () => {
            const warnSpy = jest
                .spyOn(console, "warn")
                .mockImplementation(() => {})
            uaClient.setProxy("http", "1.2.3.4", 8080)
            uaClient.disableProxy()
            expect((uaClient as any).proxy).toEqual({})
            expect(warnSpy).toHaveBeenCalledTimes(2)
            warnSpy.mockRestore()
        })
    })
})
