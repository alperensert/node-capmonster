/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from "bun:test"
import { ComplexImageTask } from "../../src"

describe("ComplexImageTask - Unit", () => {
    let client: ComplexImageTask
    let mockPost: ReturnType<typeof jest.fn>

    beforeEach(() => {
        client = new ComplexImageTask("test-api-key")
        mockPost = jest.fn()
        ;(client as any).request = { post: mockPost }
    })

    test("task() accepts recaptcha class", () => {
        const task = client.task({
            class: "recaptcha",
            imageUrls: ["https://example.com/img1.jpg"],
            metadata: { Task: "Select all buses" },
        })
        expect(task.class).toBe("recaptcha")
    })

    test("task() accepts funcaptcha class", () => {
        const task = client.task({
            class: "funcaptcha",
            imageUrls: ["https://example.com/img1.jpg"],
            metadata: { Task: "Pick the correct image" },
        })
        expect(task.class).toBe("funcaptcha")
    })

    test("createWithTask sends ComplexImageTask type", async () => {
        mockPost.mockResolvedValueOnce({
            data: { errorId: 0, taskId: 800 },
        })
        await client.createWithTask({
            class: "recaptcha",
            imageUrls: ["https://example.com/img1.jpg"],
            metadata: { Task: "Select all buses" },
        })
        const sentData = mockPost.mock.calls[0][1]
        expect(sentData.task.type).toBe("ComplexImageTask")
        expect(sentData.task.class).toBe("recaptcha")
    })

    test("getTaskResult returns boolean array answer", async () => {
        mockPost.mockResolvedValueOnce({
            data: {
                errorId: 0,
                status: "ready",
                solution: {
                    answer: [true, false, true, false, false, true, false, false, true],
                },
            },
        })
        const result = await client.getTaskResult(800)
        expect(result).not.toBeNull()
        expect(result!.answer).toEqual([
            true, false, true, false, false, true, false, false, true,
        ])
    })
})
