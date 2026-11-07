// An error with an HTTP status and a message that is safe to show the client.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFound = (what) => new HttpError(404, `${what} not found.`);
