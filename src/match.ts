import { type IHeaders, type FetchHandler, UnhandledResponseError } from "..";
import PLazy from "p-lazy";

export async function fetchMatch<T>(
  resp: Response,
  ...handlers: FetchHandler<T>[]
): Promise<T> {
  const url = new URL(resp.url);
  const headers: IHeaders = {
    urlQuery: Object.fromEntries(url.searchParams.entries()),
    code: resp.status,
    text: resp.statusText,
    headers: resp.headers.toJSON(),
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
