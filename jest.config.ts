import type { JestConfigWithTsJest } from "ts-jest"

export default async (): Promise<JestConfigWithTsJest> => {
    return {
        testTimeout: 300000,
        setupFiles: ["dotenv/config"],
        preset: "ts-jest",
        testEnvironment: "node",
        verbose: true,
    }
}
