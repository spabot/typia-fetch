export class UnhandledResponseError extends Error {
  constructor(
    public response: Response,
    public responseBody: string,
  ) {
    super("A response was not handled.");
  }
}

export interface IHeaders {
  url: URL;
  code: number;
  text: string;
  headers: Record<string, string>;
}

export type FetchHandler<T> = (
  headers: IHeaders,
  body: Promise<string>,
) => Promise<T | null>;

export { fetchMatch } from "./match";
export { fetchIs, fetchIsBody } from "./typia";
