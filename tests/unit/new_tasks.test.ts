/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import {
    AltchaTask,
    BasiliskTask,
    CastleTask,
    HuntTask,
    MtCaptchaTask,
    ProsopoTask,
    RecaptchaClickTask,
    TSPDTask,
    TurnstileWaitroomTask,
    YidunTask,
    TemuTask,
    TenDITask,
} from "../../src"

// Pattern A tasks: extend UAProxy, websiteURL + websiteKey, support proxy with Proxyless suffix
const patternATasks = [
    { name: "AltchaTask", Class: AltchaTask, type: "AltchaTask" },
    { name: "BasiliskTask", Class: BasiliskTask, type: "BasiliskTask" },
    { name: "CastleTask", Class: CastleTask, type: "CastleTask" },
    { name: "HuntTask", Class: HuntTask, type: "HuntTask" },
    { name: "MtCaptchaTask", Class: MtCaptchaTask, type: "MtCaptchaTask" },
    { name: "ProsopoTask", Class: ProsopoTask, type: "ProsopoTask" },
    {
        name: "RecaptchaClickTask",
        Class: RecaptchaClickTask,
        type: "RecaptchaClickTask",
    },
    { name: "TSPDTask", Class: TSPDTask, type: "TSPDTask" },
    {
        name: "TurnstileWaitroomTask",
        Class: TurnstileWaitroomTask,
        type: "TurnstileWaitroomTask",
    },
    { name: "YidunTask", Class: YidunTask, type: "YidunTask" },
] as const

for (const { name, Class, type } of patternATasks) {
    describe(`${name} - Unit`, () => {
        let client: InstanceType<typeof Class>
        let mockPost: ReturnType<typeof jest.fn>

        beforeEach(() => {
            client = new Class("test-api-key")
            mockPost = jest.fn()
            ;(client as any).request = { post: mockPost }
        })

        test("task() produces correct structure", () => {
            const task = client.task({
                websiteURL: "https://example.com",
                websiteKey: "site-key-123",
            })
            expect(task.websiteURL).toBe("https://example.com")
            expect(task.websiteKey).toBe("site-key-123")
        })

        test(`createWithTask sends ${type}Proxyless without proxy`, async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, taskId: 100 },
            })
            await client.createWithTask({
                websiteURL: "https://example.com",
                websiteKey: "site-key-123",
            })
            const sentData = mockPost.mock.calls[0][1]
            expect(sentData.task.type).toBe(`${type}Proxyless`)
        })

        test(`createWithTask sends ${type} with per-task proxy`, async () => {
            mockPost.mockResolvedValueOnce({
                data: { errorId: 0, taskId: 101 },
            })
            await client.createWithTask({
                websiteURL: "https://example.com",
                websiteKey: "site-key-123",
                proxy: {
                    proxyType: "http",
                    proxyAddress: "1.2.3.4",
                    proxyPort: 8080,
                },
            })
            const sentData = mockPost.mock.calls[0][1]
            expect(sentData.task.type).toBe(type)
            expect(sentData.task.proxyType).toBe("http")
            expect(sentData.task.proxyAddress).toBe("1.2.3.4")
            expect(sentData.task.proxyPort).toBe(8080)
        })

        test("getTaskResult returns solution", async () => {
            mockPost.mockResolvedValueOnce({
                data: {
                    errorId: 0,
                    status: "ready",
                    solution: {},
                },
            })
            const result = await client.getTaskResult(100)
            expect(result).not.toBeNull()
        })
    })
}

// Pattern B: CustomTask (Temu)
describe("TemuTask - Unit", () => {
    let client: TemuTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new TemuTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://temu.com",
            websiteKey: "temu-key-123",
        })
        expect(task.websiteURL).toBe("https://temu.com")
        expect(task.websiteKey).toBe("temu-key-123")
    })

    test("createWithTask sends CustomTask with Temu class", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 400 },
        })
        await client.createWithTask({
            websiteURL: "https://temu.com",
            websiteKey: "temu-key-123",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.class).toBe("Temu")
    })

    test("type does not get Proxyless appended", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 401 },
        })
        await client.createWithTask({
            websiteURL: "https://temu.com",
            websiteKey: "temu-key-123",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.type).not.toContain("Proxyless")
    })

    test("getTaskResult returns solution", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {},
            },
        })
        const result = await client.getTaskResult(400)
        expect(result).not.toBeNull()
    })
})

// Pattern B: CustomTask (TenDI)
describe("TenDITask - Unit", () => {
    let client: TenDITask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new TenDITask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() produces correct structure", () => {
        const task = client.task({
            websiteURL: "https://example.com",
            websiteKey: "189123456",
        })
        expect(task.websiteURL).toBe("https://example.com")
        expect(task.websiteKey).toBe("189123456")
    })

    test("createWithTask sends CustomTask with TenDI class", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 500 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "189123456",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.class).toBe("TenDI")
    })

    test("type does not get Proxyless appended", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 501 },
        })
        await client.createWithTask({
            websiteURL: "https://example.com",
            websiteKey: "189123456",
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("CustomTask")
        expect(sentData.task.type).not.toContain("Proxyless")
    })

    test("getTaskResult returns solution", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    data: { randstr: "abc", ticket: "xyz" },
                    headers: { "Content-Type": "application/json" },
                },
            },
        })
        const result = await client.getTaskResult(500)
        expect(result).not.toBeNull()
        expect(result!.data.randstr).toBe("abc")
        expect(result!.data.ticket).toBe("xyz")
    })
})
