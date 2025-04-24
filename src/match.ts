import { type FetchHandler, UnhandledResponseError } from "..";
import PLazy from "p-lazy";

export async function fetchMatch<T>(
  resp: Response,
  ...handlers: FetchHandler<T>[]
): Promise<T> {
  const headers = {
    ":code": resp.status.toString(),
    ":text": resp.statusText,
    ":url": resp.url,
    ...resp.headers.toJSON(),
  };

  const body = PLazy.from(() => resp.text());

  for (const handler of handlers) {
    const result = await handler(headers, body);

    if (result) {
      return result;
    }
  }

  throw new UnhandledResponseError(resp, await body);
}
