import type { FetchHandler, IHeaders } from "..";

// prettier-ignore
type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};

export function fetchIs<T, Headers extends RecursivePartial<IHeaders>>(
  isHeaders: (headers: RecursivePartial<IHeaders>) => headers is Headers,
  handle: (headers: Headers) => T,
): FetchHandler<T> {
  return async function (headers) {
    return isHeaders(headers) ? handle(headers) : null;
  };
}

export function fetchIsBody<
  T,
  Headers extends RecursivePartial<IHeaders>,
  Body,
>(
  isHeaders: (headers: RecursivePartial<IHeaders>) => headers is Headers,
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
