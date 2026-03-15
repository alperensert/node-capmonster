/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { RecaptchaV2EnterpriseTask } from "../../src"

describe("RecaptchaV2EnterpriseTask - Unit", () => {
    let client: RecaptchaV2EnterpriseTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new RecaptchaV2EnterpriseTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() accepts pageAction parameter", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "site-key",
            pageAction: "login_test",
        })
        expect(task.pageAction).toBe("login_test")
    })

    test("task() accepts all enterprise params", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "site-key",
            pageAction: "login_test",
            enterprisePayload: '{"s": "token"}',
            apiDomain: "www.recaptcha.net",
        })
        expect(task.enterprisePayload).toBe('{"s": "token"}')
        expect(task.apiDomain).toBe("www.recaptcha.net")
    })

    test("createWithTask sends pageAction", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 600 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "site-key",
            pageAction: "login_test",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.pageAction).toBe("login_test")
        expect(sentData.task.type).toBe("RecaptchaV2EnterpriseTaskProxyless")
    })
})
