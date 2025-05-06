import { tryCatch } from "..";

type EffetchOptions = RequestInit & {
  /** Primarily for SvelteKit's load function */
  event?: { fetch: typeof fetch };
  responseType?: "json" | "text";
};

async function effetch<T>(
  input: RequestInfo | URL,
  init?: EffetchOptions & { responseType?: "json" }
): Promise<T>;
async function effetch(
  input: RequestInfo | URL,
  init: EffetchOptions & { responseType: "text" }
): Promise<string>;

/**
 *
 * Effective fetch
 *
 * Sends the request and returns the response as parsed JSON (or text).
 *
 * @template T The expected type of the JSON response
 * @returns A promise that resolves to the parsed JSON or text data
 * @throws If the fetch request fails or if the JSON parsing fails
 */
async function effetch<T>(
  input: RequestInfo | URL,
  init?: EffetchOptions
): Promise<string | T> {
  const fetchFunction = init?.event?.fetch || fetch;

  const [res, err] = await tryCatch(fetchFunction(input, init));

  if (err) {
    throw new Error(`Failed to fetch: ${err}`);
  }

  if (!res) {
    throw new Error("Request sending failed unexpectedly.");
  }

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res?.status} ${res?.statusText}`);
  }

  if (init?.responseType === "text") {
    return res.text();
  }

  const [parseRes, parseErr] = await tryCatch(res.json());

  if (parseErr) {
    throw new Error(`Failed to parse JSON: ${parseErr}`);
  }

  return parseRes as T;
}

export default effetch;
