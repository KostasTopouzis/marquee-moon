// An error that carries the HTTP status and a machine-readable code
// for the response the client will receive.
// Helpers throw it; handlers catch it at their boundary.
export class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.code = code;
    }
}

// The single place where server-side exceptions become HTTP responses.
// Every error response has the same shape: { error: { code, message } }
export function toErrorResponse(error) {
    if(error instanceof HttpError) {
        return Response.json(
            { error: { code: error.code, message: error.message } },
            { status: error.status }
        );
    }

    // Anything else is an unexpected bug: log it in full, reveal nothing
    console.error(error);
    return Response.json(
        { error: { code: 'INTERNAL', message: 'Something went wrong' } },
        { status: 500 }
    );
}
