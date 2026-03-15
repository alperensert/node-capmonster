/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { BinanceTask } from "../../src"

describe("BinanceTask - Unit", () => {
    let client: BinanceTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new BinanceTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://binance.com",
            websiteKey: "bizId-123",
            validateId: "validate-456",
        })
        expect(task.websiteURL).toBe("https://binance.com")
        expect(task.websiteKey).toBe("bizId-123")
        expect(task.validateId).toBe("validate-456")
    })

    test("createWithTask sends BinanceTaskProxyless without proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 200 },
        })
        await client.createWithTask({
            websiteURL: "https://binance.com",
            websiteKey: "bizId-123",
            validateId: "validate-456",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("BinanceTaskProxyless")
        expect(sentData.task.websiteKey).toBe("bizId-123")
        expect(sentData.task.validateId).toBe("validate-456")
    })

    test("createWithTask sends BinanceTask with proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 200 },
        })
        client.setGlobalProxy({
            proxyType: "socks5",
            proxyAddress: "10.0.0.1",
            proxyPort: 1080,
        })
        await client.createWithTask({
            websiteURL: "https://binance.com",
            websiteKey: "bizId-123",
            validateId: "validate-456",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("BinanceTask")
        expect(sentData.task.proxyType).toBe("socks5")
    })
})
