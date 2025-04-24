# typia-fetch

## Example

```typescript
import typiaFetch, { UnhandledResponseError } from 'typia-fetch';
import typia from 'typia'

const resp = await fetch('https://ip.oxylabs.io/location');

try {
    const result = typiaFetch(
        resp,
        {
            headers: typia.createValidate<{

            }>()
        },
        {
        }
    );
} catch (err: unknown) {
    if (err instanceof UnhandledResponseError) {
        console.info({
            response: err.response,
            responseBody: err.responseBody ?? (await err.response.text())
        })
        return;
    }
    throw err;
}
```

## Appendix

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
