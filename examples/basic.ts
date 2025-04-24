import {
  fetchMatch,
  fetchIs,
  fetchIsBody,
  UnhandledResponseError,
} from "../src";
import typia, { type tags } from "typia";

const resp = await fetch("https://ip.oxylabs.io/location");

try {
  const result = fetchMatch<string>(
    resp,
    fetchIs(
      typia.createIs<{
        ":code": 429;
        ":text": "Too Many Requests";
      }>(),
      // Body is not downloaded
      () => "rate limited",
    ),
    fetchIsBody(
      typia.createIs<{
        ":url": {
          pathname: "/location";
        };
        ":code": 200;
        ":text": "OK";
        "content-type": "application/json";
      }>(),
      typia.json.createIsParse<{
        ip: string & (tags.Format<"ipv4"> | tags.Format<"ipv6">);
      }>(),
      (_, data) => data.ip,
    ),
  );
  console.log(result);
} catch (err: unknown) {
  if (err instanceof UnhandledResponseError) {
    console.info({
      response: err.response,
      responseBody: err.responseBody,
    });
  } else {
    throw err;
  }
}
