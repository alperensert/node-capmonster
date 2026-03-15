/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { ImpervaTask } from "../../src"

describe("ImpervaTask - Unit", () => {
    let client: ImpervaTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new ImpervaTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://protected-site.com",
            metadata: {
                incapsulaScriptUrl: "https://protected-site.com/_Incapsula_Resource",
                incapsulaCookies: "visid_incap=abc; incap_ses=xyz",
                reese84UrlEndpoint: "https://protected-site.com/a3fE",
            },
        })
        expect(task.websiteURL).toBe("https://protected-site.com")
        expect(task.metadata.incapsulaScriptUrl).toBe(
            "https://protected-site.com/_Incapsula_Resource"
        )
        expect(task.metadata.reese84UrlEndpoint).toBe(
            "https://protected-site.com/a3fE"
        )
    })

    test("createWithTask sends CustomTask with Imperva class and proxy", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 300 },
        })
        client.setGlobalProxy({
            proxyType: "http",
            proxyAddress: "1.2.3.4",
            proxyPort: 8080,
        })
        await client.createWithTask({
            websiteURL: "https://protected-site.com",
            metadata: {
                incapsulaScriptUrl: "https://protected-site.com/_Incapsula_Resource",
                incapsulaCookies: "visid_incap=abc",
                reese84UrlEndpoint: "https://protected-site.com/a3fE",
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.class).toBe("Imperva")
        expect(sentData.task.proxyType).toBe("http")
        expect(sentData.task.proxyAddress).toBe("1.2.3.4")
        expect(sentData.task.proxyPort).toBe(8080)
    })

    test("createWithTask does not append Proxyless suffix", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 300 },
        })
        await client.createWithTask({
            websiteURL: "https://protected-site.com",
            metadata: {
                incapsulaScriptUrl: "url",
                incapsulaCookies: "cookies",
                reese84UrlEndpoint: "endpoint",
            },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
    })

    test("getTaskResult returns domains object", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    domains: {
                        "site.com": {
                            cookies: { visid_incap: "new-value" },
                        },
                    },
                },
            },
        })
        const result = await client.getTaskResult(300)
        expect(result).not.toBeNull()
        expect(result!.domains).toHaveProperty(["site.com"])
    })
})
