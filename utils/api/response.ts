// base funciton
export function sendResponse(body?: BodyInit | null, init?: ResponseInit): Response {
      return new Response(body, init);
}

const createResponseBody = <T>(message: string, payload: T | null = null) => {
      return JSON.stringify({ message, payload });
};

// Error Response
export function notFoundResponse(unit?: string) {
      return sendResponse(createResponseBody(`${unit} not found!`), { status: 404 });
}

export function inValidCredentionalsResponse() {
      return sendResponse(createResponseBody('Invalid credentionals'), { status: 401 });
}

export function notValidDataResponse(unit?: string) {
      return sendResponse(createResponseBody(`${unit} isn't valid`), { status: 401 });
}

export function internalServerError(payload?: any) {
      return sendResponse(createResponseBody('Internal Server Error'), { status: 500 });
}

// Success Response
export function successResponse(message?: string) {
      return sendResponse(createResponseBody(message || ''), { status: 200 });
}
