/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import axios from "axios"
import { CapmonsterError } from "../../src"
import { CapmonsterClient } from "../../src/capmonster"

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

        test("ignores invalid timeout (0)", () => {
            client.setTimeout(0)
            expect((client as any).timeout).toBe(120)
        })

        test("ignores timeout > 300", () => {
            client.setTimeout(500)
            expect((client as any).timeout).toBe(120)
        })
    })
})
