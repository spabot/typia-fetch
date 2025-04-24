import type { FetchHandler, IHeaders } from "..";

export function fetchIs<T, Headers extends Partial<IHeaders>>(
  isHeaders: (headers: Partial<IHeaders>) => headers is Headers,
  handle: (headers: Headers) => T,
): FetchHandler<T> {
  return async function (headers) {
    return isHeaders(headers) ? handle(headers) : null;
  };
}

export function fetchIsBody<T, Headers extends Partial<IHeaders>, Body>(
  isHeaders: (headers: Partial<IHeaders>) => headers is Headers,
  parseBody: (body: string) => Body | null,
  handle: (headers: Headers, body: Body) => T,
): FetchHandler<T> {
  return async function (headers, dlBody) {
    if (!isHeaders(headers)) return null;

    const body = parseBody(await dlBody);
    if (!body) return null;

    return handle(headers, body);
  };
}
