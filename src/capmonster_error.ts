import { IErrorResponse } from "./capmonster"

export class CapmonsterError extends Error {
    error: IErrorResponse
    constructor(error: IErrorResponse) {
        super(
            `[${error.errorCode ?? `ErrorId: ${error.errorId}`}] ${
                error.errorDescription ?? "No description provided"
            }`
        )
        this.name = this.constructor.name
        this.error = error
    }
}
